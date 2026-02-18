import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { ticket_id, responsavel_email, escritorio_id } = await req.json();

    const ticket = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    if (!ticket || ticket.length === 0) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    await base44.asServiceRole.entities.Notificacao.create({
      tipo: 'ticket_atribuido',
      titulo: '📬 Novo ticket atribuído',
      mensagem: `Ticket #${ticket[0].numero_ticket}: ${ticket[0].titulo}`,
      destinatario_email: responsavel_email,
      link_acao: `${Deno.env.get('BASE44_APP_URL') || ''}/Helpdesk?ticket=${ticket_id}`,
      escritorio_id,
      ticket_id,
      prioridade: ticket[0].prioridade || 'media',
      lida: false
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});