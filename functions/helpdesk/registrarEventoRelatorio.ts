import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { escritorio_id, tipo_relatorio, filtros_aplicados, total_tickets } = await req.json();

    const evento = await base44.entities.RelatorioEvento.create({
      escritorio_id,
      tipo_relatorio,
      usuario_email: user.email,
      filtros_aplicados,
      total_tickets
    });

    return Response.json({ success: true, evento });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});