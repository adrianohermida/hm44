import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { ticket_id, escritorio_id, autor_atualizacao } = await req.json();

    const ticket = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    if (!ticket || ticket.length === 0) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    const ticketData = ticket[0];

    if (ticketData.created_by && ticketData.created_by !== autor_atualizacao) {
      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'ticket_atualizado',
        titulo: '🔄 Ticket atualizado',
        mensagem: `Seu ticket #${ticketData.numero_ticket} foi atualizado`,
        destinatario_email: ticketData.created_by,
        link_acao: `${Deno.env.get('BASE44_APP_URL') || ''}/Helpdesk?ticket=${ticket_id}`,
        escritorio_id,
        ticket_id,
        prioridade: ticketData.prioridade || 'media',
        lida: false
      });
    }

    if (ticketData.responsavel_email && ticketData.responsavel_email !== autor_atualizacao && ticketData.responsavel_email !== ticketData.created_by) {
      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'ticket_atualizado',
        titulo: '🔄 Ticket atualizado',
        mensagem: `Ticket #${ticketData.numero_ticket} que você gerencia foi atualizado`,
        destinatario_email: ticketData.responsavel_email,
        link_acao: `${Deno.env.get('BASE44_APP_URL') || ''}/Helpdesk?ticket=${ticket_id}`,
        escritorio_id,
        ticket_id,
        prioridade: ticketData.prioridade || 'media',
        lida: false
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});