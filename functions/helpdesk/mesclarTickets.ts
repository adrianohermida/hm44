import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_principal_id, tickets_secundarios, adicionar_campo_cc } = await req.json();

    if (!ticket_principal_id || !tickets_secundarios?.length) {
      return Response.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Buscar ticket principal
    const [ticketPrincipal] = await base44.asServiceRole.entities.Ticket.filter({ 
      id: ticket_principal_id 
    });

    if (!ticketPrincipal) {
      return Response.json({ error: 'Ticket principal não encontrado' }, { status: 404 });
    }

    // Buscar todos secundários
    const secundarios = await base44.asServiceRole.entities.Ticket.filter({
      id: { $in: tickets_secundarios }
    });

    // Mover todas mensagens dos secundários para o principal
    for (const secundario of secundarios) {
      const mensagens = await base44.asServiceRole.entities.TicketMensagem.filter({
        ticket_id: secundario.id
      });

      for (const msg of mensagens) {
        await base44.asServiceRole.entities.TicketMensagem.create({
          ...msg,
          ticket_id: ticket_principal_id,
          id: undefined,
          created_date: undefined,
          updated_date: undefined
        });
      }

      // Adicionar nota de mesclagem
      await base44.asServiceRole.entities.TicketMensagem.create({
        ticket_id: ticket_principal_id,
        escritorio_id: ticketPrincipal.escritorio_id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'admin',
        conteudo: `Ticket #${secundario.numero_ticket} foi mesclado neste ticket.`,
        is_internal_note: true,
        canal: 'email'
      });

      // Deletar ticket secundário
      await base44.asServiceRole.entities.Ticket.delete(secundario.id);
    }

    // Atualizar ticket principal
    await base44.asServiceRole.entities.Ticket.update(ticket_principal_id, {
      ultima_atualizacao: new Date().toISOString()
    });

    return Response.json({
      success: true,
      message: `${secundarios.length} ticket(s) mesclado(s) com sucesso`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});