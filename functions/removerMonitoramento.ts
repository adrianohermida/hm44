import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { monitoramento_id, monitoramento_externo_id } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    await fetch(`https://api.escavador.com/api/v2/monitoramentos/${monitoramento_externo_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    await base44.entities.MonitoramentoEscavador.update(monitoramento_id, { ativo: false });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});