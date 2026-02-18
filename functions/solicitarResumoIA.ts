import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    const response = await fetch('https://api.escavador.com/api/v2/processos/resumo-ia', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero_cnj })
    });

    const data = await response.json();

    await base44.entities.ResumoIAProcesso.create({
      escritorio_id: user.escritorio_id,
      processo_numero_cnj: numero_cnj,
      solicitacao_id_externo: data.solicitacao_id,
      status: 'PENDENTE'
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});