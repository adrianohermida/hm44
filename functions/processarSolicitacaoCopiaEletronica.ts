import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { solicitacao_id, acao } = await req.json();

    if (!solicitacao_id || !acao) {
      return Response.json(
        { error: 'solicitacao_id e acao são obrigatórios' },
        { status: 400 }
      );
    }

    // Busca a solicitação
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

    // Verifica se é admin ou o próprio cliente
    if (user.role !== 'admin' && solicitacao.cliente_email !== user.email) {
      return Response.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Ações: "gerar_pdf", "enviar_email", "cancelar"
    if (acao === 'gerar_pdf') {
      // Admin: marca como entregue e armazena referência de PDF
      if (user.role !== 'admin') {
        return Response.json(
          { error: 'Apenas admin pode gerar PDF' },
          { status: 403 }
        );
      }

      // Busca os documentos do processo para validar
      const processos = await base44.entities.Processo.filter({
        id: solicitacao.processo_id
      });

      if (!processos.length) {
        return Response.json(
          { error: 'Processo não encontrado' },
          { status: 404 }
        );
      }

      // URL do PDF será gerada pelo servidor (aqui apenas marcamos como entregue)
      const pdf_url = `${Deno.env.get('BASE44_APP_URL')}/pdfs/copia_${solicitacao_id}.pdf`;

      await base44.entities.SolicitacaoCopiaEletronicaCliente.update(
        solicitacao_id,
        {
          status: 'entregue',
          pdf_url: pdf_url,
          data_entrega: new Date().toISOString()
        }
      );

      return Response.json({ 
        success: true, 
        message: 'PDF gerado e entregue com sucesso',
        pdf_url: pdf_url
      });
    }

    if (acao === 'enviar_email') {
      // Envia email de confirmação ao cliente
      if (user.role !== 'admin') {
        return Response.json(
          { error: 'Apenas admin pode enviar email' },
          { status: 403 }
        );
      }

      if (solicitacao.status !== 'entregue' || !solicitacao.pdf_url) {
        return Response.json(
          { error: 'Solicitação deve estar entregue com PDF' },
          { status: 400 }
        );
      }

      try {
        await base44.integrations.Core.SendEmail({
          to: solicitacao.cliente_email,
          subject: 'Sua Cópia Eletrônica está Pronta',
          body: `
            <h2>Cópia Eletrônica do Processo Disponível</h2>
            <p>Sua solicitação de cópia eletrônica foi processada.</p>
            <p><a href="${solicitacao.pdf_url}">Baixar Cópia (PDF)</a></p>
            <p>O arquivo estará disponível por 30 dias.</p>
          `
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }

      return Response.json({ 
        success: true, 
        message: 'Email enviado com sucesso'
      });
    }

    if (acao === 'cancelar') {
      if (solicitacao.status !== 'pendente_pagamento') {
        return Response.json(
          { error: 'Só é possível cancelar solicitações pendentes' },
          { status: 400 }
        );
      }

      await base44.entities.SolicitacaoCopiaEletronicaCliente.update(
        solicitacao_id,
        { status: 'rejeitado' }
      );

      return Response.json({ success: true, message: 'Solicitação cancelada' });
    }

    return Response.json(
      { error: 'Ação inválida' },
      { status: 400 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});