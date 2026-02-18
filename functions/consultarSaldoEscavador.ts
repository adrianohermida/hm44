import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [provedor] = await base44.asServiceRole.entities.ProvedorAPI.filter({
      nome: 'Escavador'
    });

    if (!provedor) {
      return Response.json({ error: 'Provedor não encontrado' }, { status: 404 });
    }

    const [endpoint] = await base44.asServiceRole.entities.EndpointAPI.filter({
      id: provedor.endpoint_saldo_id || '694999729d2ed8feb8ddbb89'
    });

    if (!endpoint) {
      return Response.json({ error: 'Endpoint de saldo não configurado' }, { status: 404 });
    }

    const baseUrl = provedor.base_url_v1;
    const url = baseUrl + endpoint.path;

    const apiKey = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'ESCAVADOR_API_TOKEN não configurado' }, { status: 500 });
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({
        sucesso: false,
        erro: errorText
      }, { status: response.status });
    }

    const data = await response.json();

    return Response.json({
      sucesso: true,
      quantidade_creditos: data.quantidade_creditos,
      saldo: data.saldo,
      saldo_descricao: data.saldo_descricao
    });

  } catch (error) {
    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});