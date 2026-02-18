import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analise_id, endpoints } = await req.json();

    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }
    const analise = analises[0];

    const provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: analise.escritorio_id
    });

    let provedorId = provedores[0]?.id;

    if (!provedorId) {
      const novoProvedor = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: analise.escritorio_id,
        nome: analise.metadados_extraidos?.nome_api || 'API Importada',
        base_url_v1: analise.metadados_extraidos?.base_url || '',
        secret_name: 'API_TOKEN',
        ativo: true
      });
      provedorId = novoProvedor.id;
    }

    const criados = [];
    for (const ep of endpoints) {
      const novo = await base44.asServiceRole.entities.EndpointAPI.create({
        provedor_id: provedorId,
        escritorio_id: analise.escritorio_id,
        versao_api: 'V1',
        nome: ep.nome,
        descricao: ep.descricao,
        metodo: ep.metodo,
        path: ep.path,
        parametros_obrigatorios: ep.parametros_obrigatorios || [],
        parametros_opcionais: ep.parametros_opcionais || [],
        schema_resposta: ep.schema_resposta || {},
        exemplo_resposta: ep.exemplo_resposta || {},
        ativo: true
      });
      criados.push(novo.id);
    }

    return Response.json({ sucesso: true, criados: criados.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});