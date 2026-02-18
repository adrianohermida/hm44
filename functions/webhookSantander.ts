import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const payload = await req.json();
    
    if (payload.tipo === 'PIX_RECEBIDO') {
      const tarefas = await base44.asServiceRole.entities.TarefaConferenciaBancaria.filter({
        valor_esperado: payload.valor,
        status: 'PENDENTE'
      });

      if (tarefas[0]) {
        await base44.asServiceRole.entities.TarefaConferenciaBancaria.update(tarefas[0].id, {
          status: 'CONFERIDO',
          valor_recebido: payload.valor,
          data_recebida: payload.data_hora,
          data_conferencia: new Date().toISOString()
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});