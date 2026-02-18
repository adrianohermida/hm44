import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Webhook handler para confirmar pagamento Stripe
// Endpoint: POST /api/webhook/stripe-checkout

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Obtém assinatura do webhook do header
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // TODO: Verificar assinatura do webhook
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    // let event;
    // try {
    //   event = stripe.webhooks.constructEventAsync(
    //     body,
    //     signature,
    //     Deno.env.get('STRIPE_WEBHOOK_SECRET')
    //   );
    // } catch (err) {
    //   return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    // }

    const event = JSON.parse(body);

    // Processa eventos do Stripe
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const solicitacao_id = session.metadata?.solicitacao_id;

      if (!solicitacao_id) {
        return Response.json({ error: 'Invalid metadata' }, { status: 400 });
      }

      // Atualiza status da solicitação para "pagamento_confirmado"
      const base44 = createClientFromRequest(req);

      await base44.asServiceRole.entities.SolicitacaoCopiaEletronicaCliente.update(
        solicitacao_id,
        {
          status: 'pagamento_confirmado',
          stripe_payment_id: session.payment_intent
        }
      );

      // Registra log do webhook
      console.log(`Pagamento confirmado para solicitação ${solicitacao_id}`);
    }

    if (event.type === 'charge.failed') {
      const charge = event.data.object;
      const solicitacao_id = charge.metadata?.solicitacao_id;

      if (solicitacao_id) {
        const base44 = createClientFromRequest(req);
        // Revert para pendente_pagamento
        await base44.asServiceRole.entities.SolicitacaoCopiaEletronicaCliente.update(
          solicitacao_id,
          { status: 'pendente_pagamento' }
        );
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});