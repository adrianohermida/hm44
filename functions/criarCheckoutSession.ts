import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { quantidade_creditos, valor } = await req.json();

    const stripe = await import('npm:stripe@17.5.0');
    const stripeClient = stripe.default(Deno.env.get('STRIPE_SECRET_KEY'));

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: `${quantidade_creditos} créditos API Escavador` },
          unit_amount: Math.round(valor * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${Deno.env.get('APP_URL')}/faturas?success=true`,
      cancel_url: `${Deno.env.get('APP_URL')}/faturas?cancel=true`,
      metadata: { user_email: user.email, escritorio_id: user.escritorio_id, quantidade_creditos }
    });

    await base44.entities.FaturaServico.create({
      escritorio_id: user.escritorio_id,
      usuario_email: user.email,
      tipo_servico: 'CREDITOS_API',
      descricao: `${quantidade_creditos} créditos`,
      valor,
      quantidade_creditos,
      status: 'PENDENTE',
      metodo_pagamento: 'STRIPE',
      stripe_session_id: session.id
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});