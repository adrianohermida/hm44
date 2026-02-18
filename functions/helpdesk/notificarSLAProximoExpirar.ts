import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    
    for (const escritorio of escritorios) {
      const tickets = await base44.asServiceRole.entities.Ticket.filter({
        escritorio_id: escritorio.id,
        status: { $in: ['aberto', 'em_atendimento'] },
        sla_definido_horas: { $exists: true }
      });

      const now = new Date();
      
      for (const ticket of tickets) {
        const criadoEm = new Date(ticket.created_date);
        const slaHoras = ticket.sla_definido_horas || 24;
        const vencimentoSLA = new Date(criadoEm.getTime() + slaHoras * 60 * 60 * 1000);
        const horasRestantes = (vencimentoSLA - now) / (1000 * 60 * 60);

        if (horasRestantes > 0 && horasRestantes <= 2 && ticket.responsavel_email) {
          await base44.asServiceRole.entities.Notificacao.create({
            tipo: 'sla_proximo_expirar',
            titulo: '⚠️ SLA próximo de expirar',
            mensagem: `Ticket #${ticket.numero_ticket} expira em ${Math.round(horasRestantes * 60)} minutos`,
            destinatario_email: ticket.responsavel_email,
            link_acao: `${Deno.env.get('BASE44_APP_URL') || ''}/Helpdesk?ticket=${ticket.id}`,
            escritorio_id: escritorio.id,
            ticket_id: ticket.id,
            prioridade: 'urgente',
            lida: false
          });
        }
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});