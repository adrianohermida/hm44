import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { acao, certificado_id, arquivo_pfx, senha } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    let response;
    if (acao === 'listar') {
      response = await fetch('https://api.escavador.com/api/v2/certificados', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else if (acao === 'deletar') {
      response = await fetch(`https://api.escavador.com/api/v2/certificados/${certificado_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else if (acao === 'upload') {
      response = await fetch('https://api.escavador.com/api/v2/certificados', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ arquivo_pfx, senha })
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});