import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id, inclui_apensos } = await req.json();

    if (!processo_id) {
      return Response.json(
        { error: 'processo_id é obrigatório' },
        { status: 400 }
      );
    }

    // Busca escritório
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios.length) {
      return Response.json(
        { error: 'Escritório não configurado' },
        { status: 400 }
      );
    }

    // Cria solicitação
    const solicitacao = await base44.entities.SolicitacaoCopiaEletronicaCliente.create({
      processo_id: processo_id,
      cliente_email: user.email,
      escritorio_id: escritorios[0].id,
      status: 'pendente_pagamento',
      valor: 39.90,
      data_solicitacao: new Date().toISOString()
    });

    return Response.json({
      success: true,
      solicitacao_id: solicitacao.id,
      valor: 39.90,
      checkout_url: `/checkout-copia?solicitacao_id=${solicitacao.id}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});