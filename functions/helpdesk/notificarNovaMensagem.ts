import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { ticket_id, mensagem_id, escritorio_id } = await req.json();

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    const [mensagem] = await base44.asServiceRole.entities.TicketMensagem.filter({ id: mensagem_id });
    if (!mensagem) {
      return Response.json({ error: 'Mensagem não encontrada' }, { status: 404 });
    }

    // Notificar responsável se mensagem é do cliente
    if (mensagem.tipo_remetente === 'cliente' && ticket.responsavel_email) {
      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'nova_mensagem',
        titulo: '💬 Nova mensagem no ticket',
        mensagem: `${ticket.cliente_nome}: ${mensagem.conteudo.substring(0, 100)}...`,
        destinatario_email: ticket.responsavel_email,
        link_acao: `/Helpdesk?ticket=${ticket_id}`,
        escritorio_id,
        ticket_id,
        prioridade: ticket.prioridade || 'media',
        lida: false
      });
    }

    // Notificar cliente se mensagem é de agente
    if (mensagem.tipo_remetente === 'agente' && ticket.cliente_email) {
      await base44.asServiceRole.entities.Notificacao.create({
        tipo: 'nova_mensagem',
        titulo: '💬 Nova resposta ao seu ticket',
        mensagem: `${mensagem.remetente_nome} respondeu seu ticket: ${ticket.titulo}`,
        destinatario_email: ticket.cliente_email,
        link_acao: `/MeusTickets?ticket=${ticket_id}`,
        escritorio_id,
        ticket_id,
        prioridade: 'media',
        lida: false
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});