import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const inicio = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint_id, parametros = {} } = await req.json();

    if (!endpoint_id) {
      return Response.json({ 
        sucesso: false,
        erro: 'endpoint_id é obrigatório',
        http_status: 400 
      }, { status: 400 });
    }

    // Buscar endpoint e provedor
    const [endpoint] = await base44.asServiceRole.entities.EndpointAPI.filter({ id: endpoint_id });
    if (!endpoint) {
      return Response.json({ 
        sucesso: false,
        erro: 'Endpoint não encontrado',
        http_status: 404 
      }, { status: 404 });
    }

    const [provedor] = await base44.asServiceRole.entities.ProvedorAPI.filter({ 
      id: endpoint.provedor_id 
    });
    
    if (!provedor) {
      return Response.json({ 
        sucesso: false,
        erro: 'Provedor não encontrado',
        http_status: 404 
      }, { status: 404 });
    }

    // Verificar quota se configurado
    if (provedor.quota_config) {
      const hoje = new Date().toISOString().split('T')[0];
      const { consumo_dia_atual = 0, limite_diario, ultimo_reset_diario } = provedor.quota_config;
      
      // Reset diário se necessário
      if (ultimo_reset_diario !== hoje) {
        await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, {
          quota_config: {
            ...provedor.quota_config,
            consumo_dia_atual: 0,
            ultimo_reset_diario: hoje,
            quota_excedida: false
          }
        });
      } else if (limite_diario && consumo_dia_atual >= limite_diario) {
        return Response.json({
          sucesso: false,
          erro: 'Limite de quota diária excedido',
          quota_blocked: true,
          http_status: 429
        }, { status: 429 });
      }
    }

    // Construir URL base
    let baseUrl = endpoint.versao_api === 'V2' ? provedor.base_url_v2 : provedor.base_url_v1;
    
    if (!baseUrl) {
      return Response.json({ 
        sucesso: false,
        erro: `Base URL ${endpoint.versao_api} não configurada no provedor`,
        http_status: 500,
        contexto: {
          provedor_id: provedor.id,
          versao_solicitada: endpoint.versao_api,
          base_v1: provedor.base_url_v1,
          base_v2: provedor.base_url_v2
        }
      }, { status: 500 });
    }

    // Remover trailing slash da base URL
    baseUrl = baseUrl.replace(/\/$/, '');

    // Construir path completo
    let path = endpoint.path || '';
    
    // Garantir que path comece com /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Substituir path params
    const pathParams = (endpoint.parametros || []).filter(p => p.localizacao === 'path');
    pathParams.forEach(param => {
      const valor = parametros[param.nome];
      if (valor !== undefined && valor !== null && valor !== '') {
        // Substituir {param} ou {param_name} pelo valor
        path = path.replace(`{${param.nome}}`, encodeURIComponent(valor));
      }
    });

    // Construir URL completa
    let url = baseUrl + path;

    // Query params
    const queryParams = (endpoint.parametros || []).filter(p => 
      p.localizacao === 'query' || !p.localizacao // backward compatibility
    );
    
    const queryString = new URLSearchParams();
    queryParams.forEach(param => {
      const valor = parametros[param.nome];
      if (valor !== undefined && valor !== null && valor !== '') {
        queryString.append(param.nome, valor);
      }
    });
    
    if (queryString.toString()) {
      url += '?' + queryString.toString();
    }

    // Headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Autenticação
    if (provedor.requer_autenticacao) {
      if (provedor.tipo_autenticacao === 'api_key' || provedor.tipo_autenticacao === 'hybrid') {
        const secretName = provedor.api_key_config?.secret_name || provedor.secret_name;
        const apiKey = Deno.env.get(secretName);
        
        if (!apiKey) {
          return Response.json({ 
            sucesso: false,
            erro: `Secret ${secretName} não configurado`,
            http_status: 500,
            debug: {
              secretName,
              api_key_config: provedor.api_key_config,
              provedor_secret_name: provedor.secret_name,
              env_keys_available: Object.keys(Deno.env.toObject()).filter(k => k.includes('TOKEN'))
            }
          }, { status: 500 });
        }

        const headerName = provedor.api_key_config?.header_name || 'X-API-Key';
        let prefix = provedor.api_key_config?.prefix || '';
        
        // Garantir que prefix não tenha espaço duplo
        if (prefix && !prefix.endsWith(' ')) {
          prefix = prefix + ' ';
        }
        
        headers[headerName] = prefix ? `${prefix}${apiKey}` : apiKey;
      }
    }

    // Header params
    const headerParams = (endpoint.parametros || []).filter(p => p.localizacao === 'header');
    headerParams.forEach(param => {
      if (parametros[param.nome]) {
        headers[param.nome] = parametros[param.nome];
      }
    });

    // Body params - suporta Elasticsearch DSL (DataJud) e body direto
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.metodo)) {
      const bodyParams = (endpoint.parametros || []).filter(p => p.localizacao === 'body');
      
      // Verificar se é DataJud (Elasticsearch) - precisa de query wrapper
      const isElasticsearch = endpoint.path?.includes('_search') || 
                             provedor.codigo_identificador?.includes('DATAJUD');
      
      if (isElasticsearch && bodyParams.length > 0) {
        // Construir query Elasticsearch baseada em exemplo_payload
        const queryObj = { query: {}, size: 10 };
        
        // Se tem numeroProcesso, usar match simples
        if (parametros.numeroProcesso) {
          queryObj.query = {
            match: { numeroProcesso: parametros.numeroProcesso.replace(/\D/g, '') }
          };
        }
        // Se tem múltiplos campos, usar bool.must
        else if (parametros['classe.codigo'] || parametros['orgaoJulgador.codigo']) {
          queryObj.query = { bool: { must: [] } };
          if (parametros['classe.codigo']) {
            queryObj.query.bool.must.push({ match: { "classe.codigo": parametros['classe.codigo'] } });
          }
          if (parametros['orgaoJulgador.codigo']) {
            queryObj.query.bool.must.push({ match: { "orgaoJulgador.codigo": parametros['orgaoJulgador.codigo'] } });
          }
        }
        // Se tem size customizado
        if (parametros.size) {
          queryObj.size = parseInt(parametros.size);
        }
        // Se tem search_after para paginação
        if (parametros.search_after) {
          queryObj.search_after = Array.isArray(parametros.search_after) 
            ? parametros.search_after 
            : [parseInt(parametros.search_after)];
          queryObj.sort = [{ "@timestamp": { order: "asc" } }];
        }
        
        body = JSON.stringify(queryObj);
      } else {
        // Body direto para APIs normais
        const bodyData = {};
        bodyParams.forEach(param => {
          if (parametros[param.nome] !== undefined) {
            bodyData[param.nome] = parametros[param.nome];
          }
        });
        body = Object.keys(bodyData).length > 0 ? JSON.stringify(bodyData) : null;
      }
    }

    // Executar request
    const inicioReq = Date.now();
    const response = await fetch(url, {
      method: endpoint.metodo,
      headers,
      body
    });

    const tempoMs = Date.now() - inicioReq;
    const httpStatus = response.status;
    
    let respostaData = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      respostaData = await response.json();
    } else {
      respostaData = await response.text();
    }

    const sucesso = httpStatus >= 200 && httpStatus < 300;

    // Salvar histórico de teste com IDs
    const testeData = {
      endpoint_id: endpoint.id,
      escritorio_id: endpoint.escritorio_id,
      parametros_usados: parametros,
      sucesso,
      http_status: httpStatus,
      tempo_ms: tempoMs,
      resposta: respostaData,
      erro: sucesso ? null : (typeof respostaData === 'string' ? respostaData : JSON.stringify(respostaData)),
      executado_por: user.email
    };

    const testeRecord = await base44.asServiceRole.entities.TesteEndpoint.create(testeData);

    // Atualizar quota se sucesso
    if (sucesso && provedor.quota_config) {
      const novoConsumo = (provedor.quota_config.consumo_dia_atual || 0) + 1;
      const limiteAlerta = provedor.quota_config.limite_diario * (provedor.quota_config.alerta_threshold_percent || 80) / 100;
      
      await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, {
        quota_config: {
          ...provedor.quota_config,
          consumo_dia_atual: novoConsumo
        }
      });

      // Alerta de quota
      if (novoConsumo >= limiteAlerta && novoConsumo < provedor.quota_config.limite_diario) {
        return Response.json({
          sucesso,
          http_status: httpStatus,
          tempo_ms: tempoMs,
          resposta: respostaData,
          quota_warning: `⚠️ ${Math.round((novoConsumo / provedor.quota_config.limite_diario) * 100)}% da quota diária consumida`
        });
      }
    }

    return Response.json({
      sucesso,
      http_status: httpStatus,
      tempo_ms: tempoMs,
      resposta: respostaData,
      erro: sucesso ? null : 'Request falhou',
      teste_id: testeRecord.id,
      endpoint_id: endpoint.id,
      provedor_id: provedor.id,
      contexto: {
        url_completa: url,
        base_url: baseUrl,
        path: endpoint.path,
        versao_api: endpoint.versao_api,
        metodo: endpoint.metodo,
        headers_enviados: Object.keys(headers),
        parametros_usados: parametros,
        path_params_substituidos: pathParams.map(p => ({ nome: p.nome, valor: parametros[p.nome] }))
      }
    });

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    return Response.json({
      sucesso: false,
      erro: error.message,
      http_status: 500,
      tempo_ms: tempoTotal,
      contexto: {
        erro_detalhado: error.stack
      }
    }, { status: 500 });
  }
});