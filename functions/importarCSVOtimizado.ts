import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const entityName = formData.get('entity_name');

    if (!file || !entityName) {
      return Response.json({ error: 'Missing file or entity_name' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]?.trim());
      return obj;
    });

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorio_id = escritorios[0]?.id;

    const job = await base44.asServiceRole.entities.JobImportacao.create({
      escritorio_id,
      user_email: user.email,
      tipo: `IMPORTACAO_${entityName.toUpperCase()}`,
      fonte_origem: 'IMPORTACAO_ARQUIVO',
      total_registros: rows.length,
      dados: rows,
      status: 'pendente'
    });

    // Processar em background
    base44.asServiceRole.functions.invoke('processarCSVBackground', { job_id: job.id, entity_name: entityName });

    return Response.json({ job_id: job.id, total: rows.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});