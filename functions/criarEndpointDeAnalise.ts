import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analise_id, endpoint_index, provedor_id, versao_api } = await req.json();

    // Buscar análise
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }

    const analise = analises[0];
    const endpointData = analise.endpoints_extraidos[endpoint_index];

    if (!endpointData) {
      return Response.json({ error: 'Endpoint não encontrado' }, { status: 404 });
    }

    // Criar endpoint
    const novoEndpoint = await base44.asServiceRole.entities.EndpointAPI.create({
      escritorio_id: analise.escritorio_id,
      provedor_id: provedor_id || null,
      versao_api: versao_api || 'V2',
      nome: endpointData.nome,
      descricao: endpointData.descricao,
      metodo: endpointData.metodo,
      path: endpointData.path,
      parametros_obrigatorios: endpointData.parametros_obrigatorios || [],
      parametros_opcionais: endpointData.parametros_opcionais || [],
      schema_resposta: endpointData.schema_resposta || null,
      exemplo_resposta: endpointData.exemplo_resposta || null,
      ativo: true
    });

    // Atualizar endpoint na análise
    const endpointsAtualizados = [...analise.endpoints_extraidos];
    endpointsAtualizados[endpoint_index] = {
      ...endpointData,
      endpoint_criado_id: novoEndpoint.id,
      status_comparacao: 'OK',
      data_processamento: new Date().toISOString()
    };

    await base44.asServiceRole.entities.DockerAnalise.update(analise_id, {
      endpoints_extraidos: endpointsAtualizados,
      endpoints_processados: (analise.endpoints_processados || 0) + 1,
      ultima_atualizacao: new Date().toISOString()
    });

    // Adicionar log ao job
    const jobs = await base44.asServiceRole.entities.JobAnaliseDocker.filter({ analise_id });
    if (jobs.length) {
      const job = jobs[0];
      const currentLogs = job.logs || [];
      const endpointsCriados = job.endpoints_criados || [];
      
      await base44.asServiceRole.entities.JobAnaliseDocker.update(job.id, {
        endpoints_criados: [...endpointsCriados, novoEndpoint.id],
        total_endpoints_processados: (job.total_endpoints_processados || 0) + 1,
        logs: [...currentLogs, {
          timestamp: new Date().toISOString(),
          etapa: 'CRIAR_ENDPOINT',
          mensagem: `Endpoint criado: ${endpointData.nome}`,
          progresso: Math.round(((analise.endpoints_processados || 0) + 1) / analise.total_endpoints_encontrados * 100),
          tipo: 'SUCCESS'
        }]
      });
    }

    return Response.json({ 
      success: true, 
      endpoint_id: novoEndpoint.id,
      message: 'Endpoint criado com sucesso'
    });

  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});