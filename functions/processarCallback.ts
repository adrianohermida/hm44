import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callback_id } = await req.json();
    const callback = await base44.entities.CallbackEscavador.filter({ id: callback_id });
    
    if (!callback[0]) {
      return Response.json({ error: 'Callback não encontrado' }, { status: 404 });
    }

    await base44.entities.CallbackEscavador.update(callback_id, {
      processado: true,
      data_processamento: new Date().toISOString()
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});