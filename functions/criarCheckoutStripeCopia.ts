import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { solicitacao_id, cliente_email, valor } = await req.json();

    if (!solicitacao_id || !cliente_email || !valor) {
      return Response.json(
        { error: 'solicitacao_id, cliente_email e valor são obrigatórios' },
        { status: 400 }
      );
    }

    // Valida se a solicitação pertence ao usuário
    const solicitacoes = await base44.entities.SolicitacaoCopiaEletronicaCliente.filter({
      id: solicitacao_id
    });

    if (!solicitacoes.length) {
      return Response.json(
        { error: 'Solicitação não encontrada' },
        { status: 404 }
      );
    }

    const solicitacao = solicitacoes[0];
    if (solicitacao.cliente_email !== user.email && user.role !== 'admin') {
      return Response.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // TODO: Integrar com Stripe API para criar checkout session
    // Por enquanto, simular resposta para estrutura
    // Stripe API necessita: STRIPE_SECRET_KEY env var

    // Estrutura esperada de resposta:
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   mode: 'payment',
    //   line_items: [{
    //     price_data: {
    //       currency: 'brl',
    //       product_data: {
    //         name: 'Cópia Eletrônica do Processo',
    //         description: `Processo: ${solicitacao.processo_id}`
    //       },
    //       unit_amount: Math.round(valor * 100)
    //     },
    //     quantity: 1
    //   }],
    //   customer_email: cliente_email,
    //   success_url: `${Deno.env.get('BASE44_APP_URL')}/sucesso-pagamento?solicitacao_id=${solicitacao_id}`,
    //   cancel_url: `${Deno.env.get('BASE44_APP_URL')}/checkout-copia?solicitacao_id=${solicitacao_id}`,
    //   metadata: {
    //     solicitacao_id: solicitacao_id,
    //     cliente_email: cliente_email
    //   }
    // });

    // Simular resposta (estrutura pronta para Stripe)
    const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${solicitacao_id}`;

    return Response.json({
      success: true,
      checkout_url: checkoutUrl,
      session_id: `cs_test_${solicitacao_id}`,
      message: 'Checkout session criada'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});