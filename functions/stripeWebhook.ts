import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
  
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET'));

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { user_email, escritorio_id, quantidade_creditos } = session.metadata;

      const faturas = await base44.asServiceRole.entities.FaturaServico.filter({
        stripe_session_id: session.id
      });

      if (faturas[0]) {
        await base44.asServiceRole.entities.FaturaServico.update(faturas[0].id, {
          status: 'PAGO',
          data_pagamento: new Date().toISOString(),
          stripe_payment_intent: session.payment_intent
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});