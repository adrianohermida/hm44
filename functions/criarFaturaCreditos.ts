import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { quantidade_creditos, valor, metodo_pagamento } = await req.json();

    const fatura = await base44.entities.FaturaServico.create({
      escritorio_id: user.escritorio_id || 'admin',
      usuario_email: user.email,
      tipo_servico: 'CREDITOS_API',
      descricao: `Pacote de ${quantidade_creditos} créditos`,
      valor,
      quantidade_creditos,
      status: 'PENDENTE',
      metodo_pagamento
    });

    return Response.json({ fatura });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});