import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { aparicao_id, acao } = await req.json();

    const updates = {};
    if (acao === 'visualizar') updates.visualizado = true;
    if (acao === 'importante') updates.importante = true;
    if (acao === 'bloquear') updates.bloqueado = true;

    await base44.entities.AparicaoMonitoramento.update(aparicao_id, updates);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});