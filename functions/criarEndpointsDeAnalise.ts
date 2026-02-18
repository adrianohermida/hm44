import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analise_id, provedor_id, selecionar_todos, endpoint_ids } = await req.json();

    if (!analise_id || !provedor_id) {
      return Response.json({ error: 'analise_id e provedor_id são obrigatórios' }, { status: 400 });
    }

    // Buscar análise
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }
    const analise = analises[0];

    // Buscar provedor
    const provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({ id: provedor_id });
    if (!provedores.length) {
      return Response.json({ error: 'Provedor não encontrado' }, { status: 404 });
    }
    const provedor = provedores[0];

    // Buscar endpoints existentes do provedor
    const endpointsExistentes = await base44.asServiceRole.entities.EndpointAPI.filter({
      provedor_id: provedor.id,
      escritorio_id: analise.escritorio_id
    });

    // Filtrar endpoints para criar
    let endpointsParaCriar = analise.endpoints_extraidos || [];
    
    if (!selecionar_todos && endpoint_ids?.length) {
      // Selecionar apenas os IDs especificados (índices)
      endpointsParaCriar = endpointsParaCriar.filter((_, idx) => endpoint_ids.includes(idx));
    }

    const resultados = {
      criados: [],
      atualizados: [],
      duplicados: [],
      erros: []
    };

    for (const endpoint of endpointsParaCriar) {
      try {
        // Verificar duplicação REAL (path + método + provedor)
        const duplicado = endpointsExistentes.find(e =>
          e.path === endpoint.path &&
          e.metodo === endpoint.metodo &&
          e.provedor_id === provedor.id
        );

        if (duplicado) {
          // Verificar se precisa atualizar
          const precisaAtualizar =
            JSON.stringify(duplicado.parametros) !== JSON.stringify(endpoint.parametros) ||
            JSON.stringify(duplicado.schema_resposta) !== JSON.stringify(endpoint.respostas);

          if (precisaAtualizar) {
            await base44.asServiceRole.entities.EndpointAPI.update(duplicado.id, {
              parametros: endpoint.parametros || [],
              parametros_obrigatorios: endpoint.parametros?.filter(p => p.obrigatorio) || [],
              parametros_opcionais: endpoint.parametros?.filter(p => !p.obrigatorio) || [],
              schema_resposta: endpoint.respostas || {},
              exemplo_resposta: endpoint.respostas?.['200']?.exemplo || {},
              descricao: endpoint.descricao || duplicado.descricao,
              categoria: endpoint.categoria || duplicado.categoria,
              tags: endpoint.tags || duplicado.tags || []
            });
            resultados.atualizados.push(duplicado.id);
          } else {
            resultados.duplicados.push({
              path: endpoint.path,
              metodo: endpoint.metodo,
              id: duplicado.id
            });
          }
        } else {
          // Criar novo endpoint
          const novoEndpoint = await base44.asServiceRole.entities.EndpointAPI.create({
            provedor_id: provedor.id,
            escritorio_id: analise.escritorio_id,
            versao_api: provedor.base_url_v1?.includes('/v2') ? 'V2' : 'V1',
            nome: endpoint.nome || `${endpoint.metodo} ${endpoint.path}`,
            descricao: endpoint.descricao || '',
            categoria: endpoint.categoria || 'Sem Categoria',
            metodo: endpoint.metodo,
            path: endpoint.path,
            requer_autenticacao: provedor.requer_autenticacao,
            parametros: endpoint.parametros || [],
            parametros_obrigatorios: endpoint.parametros?.filter(p => p.obrigatorio) || [],
            parametros_opcionais: endpoint.parametros?.filter(p => !p.obrigatorio) || [],
            schema_resposta: endpoint.respostas || {},
            exemplo_payload: endpoint.corpo_requisicao?.exemplo || {},
            exemplo_resposta: endpoint.respostas?.['200']?.exemplo || {},
            documentacao_url: provedor.documentacao_url || '',
            creditos_consumidos: endpoint.precificacao?.creditos || 0,
            ativo: true,
            tags: endpoint.tags || []
          });
          resultados.criados.push(novoEndpoint.id);
        }
      } catch (error) {
        resultados.erros.push({
          endpoint: `${endpoint.metodo} ${endpoint.path}`,
          erro: error.message
        });
      }
    }

    return Response.json({
      sucesso: true,
      provedor_nome: provedor.nome,
      estatisticas: {
        total_processados: endpointsParaCriar.length,
        criados: resultados.criados.length,
        atualizados: resultados.atualizados.length,
        duplicados: resultados.duplicados.length,
        erros: resultados.erros.length
      },
      detalhes: resultados
    });

  } catch (error) {
    console.error('Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});