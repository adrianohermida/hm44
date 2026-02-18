import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { fatura_id, valor_esperado, data_esperada } = await req.json();

    const tarefa = await base44.entities.TarefaConferenciaBancaria.create({
      escritorio_id: user.escritorio_id || 'admin',
      fatura_id,
      valor_esperado,
      data_esperada,
      status: 'PENDENTE',
      tipo_integracao: 'API_SANTANDER'
    });

    return Response.json({ tarefa });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});