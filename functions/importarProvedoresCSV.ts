import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_url } = await req.json();

    let escritorio;
    if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
      const todosEscritorios = await base44.asServiceRole.entities.Escritorio.list();
      escritorio = todosEscritorios[0];
    } else {
      const escritorios = await base44.asServiceRole.entities.Escritorio.filter({ created_by: user.email });
      if (!escritorios.length) {
        return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
      }
      escritorio = escritorios[0];
    }

    const fileRes = await fetch(file_url);
    const csvText = await fileRes.text();
    
    const lines = csvText.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const provedores = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.trim().replace(/"/g, '') || '';
      });

      if (!row.nome) continue;

      const provedor = {
        escritorio_id: escritorio.id,
        nome: row.nome.replace(/"/g, ''),
        tipo: (row.tipo || 'REST').replace(/"/g, ''),
        base_url_v1: (row.url_base || '').replace(/"/g, ''),
        base_url_v2: row.api_versions?.includes('v2') ? row.url_base.replace(/"/g, '') : '',
        secret_name: (row.secret_key_name || 'API_TOKEN').replace(/"/g, ''),
        descricao: (row.tags || '').replace(/"/g, ''),
        documentacao_url: (row.documentacao_url || '').replace(/"/g, ''),
        ativo: row.ativo === 'true' || row.ativo === '1',
        saude_status: (row.saude_status || 'Desconhecido').replace(/"/g, ''),
        latencia_media_ms: parseInt(row.latencia_media_ms) || 0,
        ultima_verificacao: row.ultima_verificacao || null,
        taxa_sucesso: parseFloat(row.taxa_sucesso) || 100,
        total_requisicoes: parseInt(row.total_requisicoes) || 0
      };

      provedores.push(provedor);
    }

    const criados = await base44.asServiceRole.entities.ProvedorAPI.bulkCreate(provedores);

    return Response.json({ sucesso: true, total: criados.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});