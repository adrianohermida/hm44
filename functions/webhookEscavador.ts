import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const authHeader = req.headers.get('Authorization');
  const expectedToken = Deno.env.get('ESCAVADOR_CALLBACK_TOKEN');
  
  if (!authHeader || authHeader !== expectedToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    
    await base44.asServiceRole.entities.CallbackEscavador.create({
      escritorio_id: 'admin',
      callback_id_externo: payload.id || null,
      uuid: payload.uuid,
      evento: payload.event,
      objeto_type: payload.objeto_type || 'Monitoramento',
      objeto_id: payload.objeto_id || 0,
      status: 'Sucesso',
      payload,
      processado: false
    });

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});