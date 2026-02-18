import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { to, subject, body, ticket_id } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: 'Campos obrigatórios: to, subject, body' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Dr. Adriano Hermida Maia App',
      to,
      subject,
      body
    });

    if (ticket_id) {
      await base44.asServiceRole.entities.TicketMensagem.create({
        ticket_id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'agente',
        conteudo: body,
        canal: 'email'
      });

      await base44.asServiceRole.entities.Ticket.update(ticket_id, {
        status: 'aguardando_cliente'
      });
    }

    await base44.asServiceRole.entities.AuditoriaAcesso.create({
      user_id: user.id,
      user_email: user.email,
      recurso_tipo: 'Ticket',
      recurso_id: ticket_id || to,
      acao: 'CREATE',
      detalhes: { subject, to, via: 'email' }
    });

    return Response.json({ 
      success: true, 
      message: 'E-mail enviado com sucesso',
      ticket_id 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});