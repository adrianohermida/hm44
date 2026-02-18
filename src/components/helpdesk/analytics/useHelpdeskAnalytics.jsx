import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { startOfDay, endOfDay, subDays, differenceInMinutes } from 'date-fns';

export function useHelpdeskAnalytics(escritorioId, dateRange) {
  const startDate = dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(new Date(), 30));
  const endDate = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(new Date());

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['analytics-tickets', escritorioId, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const all = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorioId 
      }, '-created_date', 500);
      
      return all.filter(t => {
        const created = new Date(t.created_date);
        return created >= startDate && created <= endDate;
      });
    },
    enabled: !!escritorioId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  // KPIs
  const totalTickets = tickets.length;
  const ticketsAbertos = tickets.filter(t => ['triagem', 'aberto', 'em_atendimento'].includes(t.status)).length;
  const ticketsResolvidos = tickets.filter(t => ['resolvido', 'fechado'].includes(t.status)).length;
  const taxaResolucao = totalTickets > 0 ? ((ticketsResolvidos / totalTickets) * 100).toFixed(1) : 0;

  // Tempo médio primeira resposta
  const ticketsComResposta = tickets.filter(t => t.tempo_primeira_resposta);
  const tempoMedioPrimeiraResposta = ticketsComResposta.length > 0
    ? ticketsComResposta.reduce((acc, t) => {
        const diff = differenceInMinutes(new Date(t.tempo_primeira_resposta), new Date(t.created_date));
        return acc + diff;
      }, 0) / ticketsComResposta.length
    : 0;

  // Distribuição por status
  const distribuicaoStatus = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  // Distribuição por prioridade
  const distribuicaoPrioridade = tickets.reduce((acc, t) => {
    acc[t.prioridade] = (acc[t.prioridade] || 0) + 1;
    return acc;
  }, {});

  // Distribuição por canal
  const distribuicaoCanal = tickets.reduce((acc, t) => {
    const canal = t.canal || 'email';
    acc[canal] = (acc[canal] || 0) + 1;
    return acc;
  }, {});

  // Tendência (últimos 7 dias)
  const tendencia = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const count = tickets.filter(t => {
      const created = new Date(t.created_date);
      return created >= dayStart && created <= dayEnd;
    }).length;
    tendencia.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      tickets: count
    });
  }

  // Alertas
  const slaProximoExpirar = tickets.filter(t => {
    if (t.status === 'resolvido' || t.status === 'fechado') return false;
    const created = new Date(t.created_date);
    const now = new Date();
    const horasDecorridas = differenceInMinutes(now, created) / 60;
    return horasDecorridas > 20 && horasDecorridas < 24;
  }).length;

  const semResposta4h = tickets.filter(t => {
    if (t.tempo_primeira_resposta) return false;
    const created = new Date(t.created_date);
    const now = new Date();
    const horasDecorridas = differenceInMinutes(now, created) / 60;
    return horasDecorridas > 4;
  }).length;

  return {
    isLoading,
    tickets,
    kpis: {
      totalTickets,
      ticketsAbertos,
      ticketsResolvidos,
      taxaResolucao,
      tempoMedioPrimeiraResposta: Math.round(tempoMedioPrimeiraResposta)
    },
    distribuicao: {
      status: distribuicaoStatus,
      prioridade: distribuicaoPrioridade,
      canal: distribuicaoCanal
    },
    tendencia,
    alertas: {
      slaProximoExpirar,
      semResposta4h
    }
  };
}