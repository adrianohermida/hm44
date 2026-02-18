import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { monitoramento_id, monitoramento_externo_id, dados } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    const response = await fetch(`https://api.escavador.com/api/v2/monitoramentos/${monitoramento_externo_id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const data = await response.json();

    if (response.ok) {
      await base44.entities.MonitoramentoEscavador.update(monitoramento_id, dados);
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});