import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const inicio = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provedor_id } = await req.json();

    if (!provedor_id) {
      return Response.json({ 
        erro: 'provedor_id é obrigatório',
        saude: 'Desconhecido'
      }, { status: 400 });
    }

    // Buscar provedor
    const [provedor] = await base44.asServiceRole.entities.ProvedorAPI.filter({ id: provedor_id });
    
    if (!provedor) {
      return Response.json({ 
        erro: 'Provedor não encontrado',
        saude: 'Desconhecido'
      }, { status: 404 });
    }

    // Buscar um endpoint de health check ou o primeiro endpoint GET
    const endpoints = await base44.asServiceRole.entities.EndpointAPI.filter({ 
      provedor_id: provedor_id 
    });

    if (endpoints.length === 0) {
      return Response.json({ 
        erro: 'Nenhum endpoint configurado para testar',
        saude: 'Desconhecido',
        latencia_ms: 0
      });
    }

    // Priorizar endpoints GET simples sem parâmetros obrigatórios
    let endpointTeste = endpoints.find(e => {
      const temParamsObrigatorios = (e.parametros || []).some(p => p.obrigatorio);
      return e.metodo === 'GET' && !temParamsObrigatorios && 
        (e.nome.toLowerCase().includes('list') || 
         e.nome.toLowerCase().includes('channels') ||
         e.nome.toLowerCase().includes('videos'));
    }) || endpoints.find(e => e.metodo === 'GET') || endpoints[0];

    // Construir URL de teste
    const baseUrl = endpointTeste.versao_api === 'V2' 
      ? provedor.base_url_v2 
      : (endpointTeste.versao_api === 'v3' || endpointTeste.versao_api === 'V3')
        ? provedor.base_url_v2 // v3 usa base_url_v2 (caso YouTube)
        : provedor.base_url_v1;
    
    if (!baseUrl) {
      return Response.json({ 
        erro: `Base URL não configurada para ${endpointTeste.versao_api}`,
        saude: 'Indisponível',
        latencia_ms: 0
      });
    }

    let url = baseUrl + endpointTeste.path;

    // Adicionar query params obrigatórios com valores mínimos
    const queryParams = (endpointTeste.parametros || []).filter(p => 
      p.localizacao === 'query' && p.obrigatorio
    );
    
    if (queryParams.length > 0) {
      const searchParams = new URLSearchParams();
      queryParams.forEach(param => {
        // Para YouTube, usar valor mínimo para economizar quota
        let valor = param.exemplo || param.valor_padrao;
        if (!valor) {
          if (param.nome === 'maxResults' || param.nome === 'max_results') {
            valor = '1'; // Mínimo para economizar quota
          } else if (param.nome === 'part') {
            valor = 'snippet'; // Part mais leve do YouTube
          } else {
            valor = 'test';
          }
        }
        searchParams.append(param.nome, valor);
      });
      url += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }

    // Substituir path params obrigatórios com valores de exemplo
    const pathParams = (endpointTeste.parametros || []).filter(p => p.localizacao === 'path' && p.obrigatorio);
    pathParams.forEach(param => {
      const valorExemplo = param.exemplo || param.valor_padrao || 'test';
      url = url.replace(`{${param.nome}}`, valorExemplo);
    });

    // Headers básicos
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Base44-HealthCheck/1.0'
    };

    // Autenticação
    if (provedor.requer_autenticacao) {
      if (provedor.tipo_autenticacao === 'api_key' || provedor.tipo_autenticacao === 'hybrid') {
        const secretName = provedor.api_key_config?.secret_name || provedor.secret_name;
        const apiKey = Deno.env.get(secretName);
        
        if (!apiKey) {
          return Response.json({ 
            erro: `Secret ${secretName} não configurado`,
            saude: 'Indisponível',
            latencia_ms: 0,
            detalhes: 'Configure o secret no painel de Secrets para testar a conexão'
          });
        }

        // Para YouTube/Google, colocar API key na URL como query param
        if (provedor.nome?.toLowerCase().includes('youtube') || 
            provedor.nome?.toLowerCase().includes('google')) {
          url += (url.includes('?') ? '&' : '?') + `key=${apiKey}`;
        } else {
          const headerName = provedor.api_key_config?.header_name || 'X-API-Key';
          const prefix = provedor.api_key_config?.prefix || '';
          headers[headerName] = prefix ? `${prefix} ${apiKey}` : apiKey;
        }
      }
    }

    // Executar health check com timeout de 10s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let httpStatus = 0;
    let saude = 'Desconhecido';
    let erroMensagem = null;

    try {
      const inicioReq = Date.now();
      const response = await fetch(url, {
        method: endpointTeste.metodo,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latenciaMs = Date.now() - inicioReq;
      httpStatus = response.status;

      // Determinar saúde baseado em latência e status
      if (httpStatus >= 200 && httpStatus < 300) {
        if (latenciaMs < 1000) {
          saude = 'Saudável';
        } else if (latenciaMs < 3000) {
          saude = 'Degradado';
        } else {
          saude = 'Degradado';
          erroMensagem = 'Alta latência detectada';
        }
      } else if (httpStatus >= 500) {
        saude = 'Indisponível';
        erroMensagem = `Erro do servidor: ${httpStatus}`;
      } else if (httpStatus >= 400) {
        saude = 'Degradado';
        erroMensagem = `Erro de cliente: ${httpStatus}`;
      } else {
        saude = 'Desconhecido';
      }

      // Salvar histórico
      await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
        provedor_id: provedor_id,
        escritorio_id: provedor.escritorio_id,
        saude,
        latencia_ms: latenciaMs,
        http_status: httpStatus,
        erro: erroMensagem,
        tipo_teste: 'manual',
        detalhes: {
          endpoint_testado: endpointTeste.nome,
          url_testado: url,
          metodo: endpointTeste.metodo
        }
      });

      // Atualizar status do provedor
      await base44.asServiceRole.entities.ProvedorAPI.update(provedor_id, {
        saude_status: saude,
        latencia_media_ms: latenciaMs,
        ultima_verificacao: new Date().toISOString(),
        taxa_sucesso: httpStatus >= 200 && httpStatus < 300 ? 100 : 0
      });

      return Response.json({
        saude,
        latencia_ms: latenciaMs,
        http_status: httpStatus,
        erro: erroMensagem,
        endpoint_testado: endpointTeste.nome,
        url_testado: url,
        metodo: endpointTeste.metodo,
        detalhes: {
          secret_usado: provedor.api_key_config?.secret_name || provedor.secret_name
        }
      });

    } catch (error) {
      clearTimeout(timeoutId);
      const latenciaMs = Date.now() - inicio;

      if (error.name === 'AbortError') {
        saude = 'Indisponível';
        erroMensagem = 'Timeout após 10 segundos';
      } else {
        saude = 'Indisponível';
        erroMensagem = error.message;
      }

      // Salvar histórico de falha
      await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
        provedor_id: provedor_id,
        escritorio_id: provedor.escritorio_id,
        saude: 'Indisponível',
        latencia_ms: latenciaMs,
        http_status: 0,
        erro: erroMensagem,
        tipo_teste: 'manual',
        detalhes: {
          endpoint_testado: endpointTeste.nome,
          erro_stack: error.stack
        }
      });

      // Atualizar status do provedor
      await base44.asServiceRole.entities.ProvedorAPI.update(provedor_id, {
        saude_status: saude,
        latencia_media_ms: 0,
        ultima_verificacao: new Date().toISOString(),
        taxa_sucesso: 0
      });

      return Response.json({
        saude,
        latencia_ms: latenciaMs,
        http_status: 0,
        erro: erroMensagem,
        endpoint_testado: endpointTeste?.nome || 'Desconhecido',
        url_testado: url,
        metodo: endpointTeste?.metodo,
        detalhes: {
          secret_usado: provedor.api_key_config?.secret_name || provedor.secret_name,
          erro_tipo: error.name
        }
      });
    }

  } catch (error) {
    const tempoTotal = Date.now() - inicio;
    return Response.json({
      saude: 'Desconhecido',
      latencia_ms: tempoTotal,
      erro: error.message,
      http_status: 0
    }, { status: 500 });
  }
});