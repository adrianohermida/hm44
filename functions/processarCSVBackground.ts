import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { job_id, entity_name } = await req.json();

    const job = await base44.asServiceRole.entities.JobImportacao.filter({ id: job_id });
    if (!job[0]) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'processando',
      tempo_inicio: new Date().toISOString()
    });

    const dados = job[0].dados;
    const batchSize = 100;
    let processados = 0;
    let sucesso = 0;
    let falhas = 0;

    for (let i = 0; i < dados.length; i += batchSize) {
      const batch = dados.slice(i, i + batchSize);
      try {
        await base44.asServiceRole.entities[entity_name].bulkCreate(batch);
        sucesso += batch.length;
      } catch (error) {
        falhas += batch.length;
      }
      processados += batch.length;

      await base44.asServiceRole.entities.JobImportacao.update(job_id, {
        registros_processados: processados,
        registros_sucesso: sucesso,
        registros_falha: falhas,
        progresso_percentual: Math.round((processados / dados.length) * 100)
      });
    }

    await base44.asServiceRole.entities.JobImportacao.update(job_id, {
      status: 'concluido',
      tempo_conclusao: new Date().toISOString()
    });

    return Response.json({ success: true, processados, sucesso, falhas });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});