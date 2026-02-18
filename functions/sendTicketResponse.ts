import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId, message } = await req.json();

    const ticket = await base44.asServiceRole.entities.Ticket.get(ticketId);
    
    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id: ticketId,
      remetente_email: 'assistente@sistema.com',
      remetente_nome: 'Assistente Virtual',
      tipo_remetente: 'admin',
      conteudo: message,
      escritorio_id: ticket.escritorio_id
    });

    await base44.asServiceRole.entities.Ticket.update(ticketId, {
      status: 'respondida'
    });

    return Response.json({ success: true, message: 'Resposta enviada' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});