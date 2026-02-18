import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assinante_id, plano, valor } = await req.json();

    if (!assinante_id) {
      return Response.json(
        { error: 'assinante_id é obrigatório' },
        { status: 400 }
      );
    }

    // Valida se a assinatura pertence ao usuário
    const assinantes = await base44.entities.AssinanteFliBook.filter({
      id: assinante_id
    });

    if (!assinantes.length) {
      return Response.json(
        { error: 'Assinatura não encontrada' },
        { status: 404 }
      );
    }

    const assinante = assinantes[0];
    if (assinante.cliente_email !== user.email && user.role !== 'admin') {
      return Response.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // TODO: Integrar com Stripe API para criar checkout session (subscription ou payment)
    // Para assinatura parcelada: usar "subscription" mode
    // Para assinatura avista: usar "payment" mode

    const checkoutUrl = `https://checkout.stripe.com/pay/cs_flipbook_${assinante_id}`;

    return Response.json({
      success: true,
      checkout_url: checkoutUrl,
      session_id: `cs_flipbook_${assinante_id}`,
      message: 'Checkout FliBOOK session criada'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});