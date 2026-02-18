import { useMemo } from 'react';

export function useKPICalculations(tickets = []) {
  return useMemo(() => {
    const abertos = tickets.filter(t => ['aberto', 'em_atendimento'].includes(t.status)).length;
    
    const hoje = new Date().toISOString().split('T')[0];
    const resolvidosHoje = tickets.filter(t => 
      t.status === 'resolvido' && 
      t.tempo_resolucao?.startsWith(hoje)
    ).length;

    const ticketsComSLA = tickets.filter(t => t.sla_definido_horas);
    const slaViolado = ticketsComSLA.filter(t => {
      if (!t.tempo_primeira_resposta) return false;
      const criado = new Date(t.created_date);
      const respondido = new Date(t.tempo_primeira_resposta);
      const horasResposta = (respondido - criado) / (1000 * 60 * 60);
      return horasResposta > (t.sla_definido_horas || 24);
    }).length;

    const percentualSLA = ticketsComSLA.length > 0
      ? Math.round(((ticketsComSLA.length - slaViolado) / ticketsComSLA.length) * 100)
      : 100;

    const ticketsAvaliados = tickets.filter(t => t.rating_cliente);
    const satisfacaoMedia = ticketsAvaliados.length > 0
      ? (ticketsAvaliados.reduce((acc, t) => acc + (t.rating_cliente || 0), 0) / ticketsAvaliados.length).toFixed(1)
      : null;
    
    const temposResposta = tickets
      .filter(t => t.tempo_primeira_resposta)
      .map(t => {
        const criado = new Date(t.created_date);
        const respondido = new Date(t.tempo_primeira_resposta);
        return (respondido - criado) / (1000 * 60);
      });
    
    const tempoMedioResposta = temposResposta.length > 0
      ? Math.round(temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length)
      : 0;

    const resolvidos = tickets.filter(t => t.status === 'resolvido').length;
    const taxaResolucao = tickets.length > 0
      ? Math.round((resolvidos / tickets.length) * 100)
      : 0;

    return {
      abertos,
      resolvidosHoje,
      percentualSLA,
      slaViolado,
      satisfacaoMedia,
      ticketsAvaliados: ticketsAvaliados.length,
      tempoMedioResposta,
      temposResposta: temposResposta.length,
      taxaResolucao,
      resolvidos,
      total: tickets.length,
      ticketsComSLA: ticketsComSLA.length
    };
  }, [tickets]);
}