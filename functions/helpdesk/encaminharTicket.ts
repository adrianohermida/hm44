import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id, destinatario_email, mensagem } = await req.json();

    if (!ticket_id || !destinatario_email) {
      return Response.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });

    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    // Atualizar responsável
    await base44.asServiceRole.entities.Ticket.update(ticket_id, {
      responsavel_email: destinatario_email,
      ultima_atualizacao: new Date().toISOString()
    });

    // Criar nota de encaminhamento
    await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id,
      escritorio_id: ticket.escritorio_id,
      remetente_email: user.email,
      remetente_nome: user.full_name,
      tipo_remetente: 'admin',
      conteudo: `Ticket encaminhado para ${destinatario_email}${mensagem ? `\n\nMensagem: ${mensagem}` : ''}`,
      is_internal_note: true,
      canal: 'email'
    });

    // Notificar destinatário
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: destinatario_email,
      subject: `Ticket #${ticket.numero_ticket} encaminhado para você`,
      body: `
        <h2>Ticket Encaminhado</h2>
        <p><strong>De:</strong> ${user.full_name}</p>
        <p><strong>Ticket:</strong> ${ticket.titulo}</p>
        ${mensagem ? `<p><strong>Mensagem:</strong> ${mensagem}</p>` : ''}
        <p><a href="${Deno.env.get('APP_URL')}/Helpdesk?ticket=${ticket_id}">Ver ticket</a></p>
      `
    });

    return Response.json({
      success: true,
      message: 'Ticket encaminhado com sucesso'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});