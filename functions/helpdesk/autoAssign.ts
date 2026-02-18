import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { ticket_id } = await req.json();

    if (!ticket_id) {
      return Response.json({ error: 'ticket_id é obrigatório' }, { status: 400 });
    }

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    
    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    // Buscar departamento
    let departamento = null;
    if (ticket.departamento_id) {
      [departamento] = await base44.asServiceRole.entities.Departamento.filter({
        id: ticket.departamento_id,
        ativo: true
      });
    }

    // Buscar todos tickets em aberto do escritório
    const ticketsAbertos = await base44.asServiceRole.entities.Ticket.filter({
      escritorio_id: ticket.escritorio_id,
      status: { $in: ['aberto', 'em_atendimento'] }
    });

    // Contar tickets por agente
    const ticketsPorAgente = {};
    ticketsAbertos.forEach(t => {
      if (t.responsavel_email) {
        ticketsPorAgente[t.responsavel_email] = (ticketsPorAgente[t.responsavel_email] || 0) + 1;
      }
    });

    // Buscar membros do departamento ou todos admins
    let agentes = [];
    if (departamento && departamento.membros_emails.length > 0) {
      agentes = departamento.membros_emails;
    } else {
      const users = await base44.asServiceRole.entities.User.filter({
        role: 'admin'
      });
      agentes = users.filter(u => u.escritorio_id === ticket.escritorio_id || !u.escritorio_id).map(u => u.email);
    }

    if (agentes.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'Nenhum agente disponível' 
      }, { status: 404 });
    }

    // Round-robin: seleciona agente com menos tickets
    const agenteEscolhido = agentes.reduce((menorCarga, agente) => {
      const cargaAtual = ticketsPorAgente[agente] || 0;
      const menorCargaAtual = ticketsPorAgente[menorCarga] || 0;
      return cargaAtual < menorCargaAtual ? agente : menorCarga;
    });

    // Atribuir ticket
    await base44.asServiceRole.entities.Ticket.update(ticket_id, {
      responsavel_email: agenteEscolhido,
      status: 'em_atendimento',
      ultima_atualizacao: new Date().toISOString()
    });

    // Criar SLA
    const slaHoras = departamento?.sla_padrao_horas || 24;
    const dataVencimento = new Date();
    dataVencimento.setHours(dataVencimento.getHours() + slaHoras);

    await base44.asServiceRole.entities.TicketSLA.create({
      ticket_id,
      sla_definido_horas: slaHoras,
      data_vencimento_sla: dataVencimento.toISOString()
    });

    return Response.json({
      success: true,
      responsavel: agenteEscolhido,
      sla_horas: slaHoras
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});