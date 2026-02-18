import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { ticket_id } = await req.json();

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    const [sla] = await base44.asServiceRole.entities.TicketSLA.filter({ ticket_id });

    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    const agora = new Date();
    const criacao = new Date(ticket.created_date);

    // Tempo primeira resposta
    let tempoPrimeiraResposta = null;
    if (ticket.tempo_primeira_resposta) {
      const primeiraResposta = new Date(ticket.tempo_primeira_resposta);
      tempoPrimeiraResposta = Math.floor((primeiraResposta - criacao) / 60000);
    }

    // Tempo resolução
    let tempoResolucao = null;
    if (ticket.tempo_resolucao) {
      const resolucao = new Date(ticket.tempo_resolucao);
      tempoResolucao = Math.floor((resolucao - criacao) / 60000);
    }

    // Calcular percentual SLA
    let percentualSLA = 0;
    if (sla?.data_vencimento_sla) {
      const vencimento = new Date(sla.data_vencimento_sla);
      const tempoTotal = vencimento - criacao;
      const tempoDecorrido = agora - criacao;
      percentualSLA = Math.min(100, (tempoDecorrido / tempoTotal) * 100);
    }

    const updateData = {
      percentual_sla_usado: percentualSLA
    };

    if (tempoPrimeiraResposta) {
      updateData.tempo_primeira_resposta_minutos = tempoPrimeiraResposta;
      updateData.violou_sla_resposta = tempoPrimeiraResposta > (sla?.sla_definido_horas || 24) * 60;
    }

    if (tempoResolucao) {
      updateData.tempo_resolucao_minutos = tempoResolucao;
      updateData.violou_sla_resolucao = tempoResolucao > (sla?.sla_definido_horas || 24) * 60;
    }

    if (sla) {
      await base44.asServiceRole.entities.TicketSLA.update(sla.id, updateData);
    }

    return Response.json({
      success: true,
      sla: {
        ...sla,
        ...updateData
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});