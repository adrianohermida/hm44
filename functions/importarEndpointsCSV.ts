import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let escritorio;
    if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
      const todosEscritorios = await base44.asServiceRole.entities.Escritorio.list();
      escritorio = todosEscritorios[0];
    } else {
      const escritorios = await base44.asServiceRole.entities.Escritorio.filter({ 
        created_by: user.email 
      });
      if (!escritorios.length) {
        return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
      }
      escritorio = escritorios[0];
    }

    const { file_url } = await req.json();

    const fileRes = await fetch(file_url);
    const csvText = await fileRes.text();
    
    const lines = csvText.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorio.id
    });

    const imported = [];
    const erros = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.trim() || '';
      });

      if (!row.name) continue;

      let provedor = null;
      if (row.provider_id) {
        provedor = provedores.find(p => p.id === row.provider_id);
      }
      if (!provedor && row.provider) {
        provedor = provedores.find(p => 
          p.nome.toLowerCase().includes(row.provider.toLowerCase())
        );
      }
      if (!provedor) {
        provedor = provedores[0];
      }

      if (!provedor) {
        erros.push({ linha: i, erro: 'Provedor não encontrado', name: row.name });
        continue;
      }

      let endpoints = [];
      try {
        if (row.endpoints) {
          endpoints = JSON.parse(row.endpoints);
        }
      } catch (e) {
        endpoints = [];
      }

      for (const endpoint of (endpoints.length ? endpoints : [{}])) {
        const novo = {
          provedor_id: provedor.id,
          escritorio_id: escritorio.id,
          nome: endpoint.name || row.name || 'Endpoint',
          descricao: endpoint.description || row.description || '',
          categoria: endpoint.category || row.category || 'Geral',
          metodo: endpoint.method || 'GET',
          path: endpoint.path || row.api_base_url || '/api',
          versao_api: row.version === 'V1' ? 'V1' : 'V2',
          documentacao_url: endpoint.documentation_url || row.documentation_url || '',
          parametros_obrigatorios: endpoint.required_params || [],
          parametros_opcionais: endpoint.optional_params || [],
          schema_resposta: endpoint.response_schema || {},
          ativo: row.status === 'Ativo' || row.status === 'active'
        };

        try {
          const criado = await base44.asServiceRole.entities.EndpointAPI.create(novo);
          imported.push(criado);
        } catch (e) {
          erros.push({ linha: i, erro: e.message, name: novo.nome });
        }
      }
    }

    return Response.json({ 
      imported: imported.length, 
      endpoints: imported,
      erros: erros.length > 0 ? erros : undefined 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});