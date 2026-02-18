import React from 'react';
import { Inbox, Clock, CheckCircle, Target, Star } from 'lucide-react';
import { useKPICalculations } from './useKPICalculations';
import KPICardItem from './KPICardItem';

export default function KPICards({ tickets = [], range }) {
  const stats = useKPICalculations(tickets);

  const kpis = [
    {
      title: 'Tickets Abertos',
      value: stats.abertos,
      subtitle: `${stats.total} total`,
      icon: Inbox,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Tempo Médio Resposta',
      value: stats.tempoMedioResposta > 60 ? `${Math.round(stats.tempoMedioResposta / 60)}h` : `${stats.tempoMedioResposta}min`,
      subtitle: `${stats.temposResposta} tickets respondidos`,
      icon: Clock,
      color: stats.tempoMedioResposta > 120 ? 'text-red-600' : 'text-orange-600',
      bg: stats.tempoMedioResposta > 120 ? 'bg-red-50' : 'bg-orange-50'
    },
    {
      title: 'Taxa de Resolução',
      value: `${stats.taxaResolucao}%`,
      subtitle: `${stats.resolvidos} resolvidos`,
      icon: CheckCircle,
      color: stats.taxaResolucao >= 80 ? 'text-green-600' : 'text-yellow-600',
      bg: stats.taxaResolucao >= 80 ? 'bg-green-50' : 'bg-yellow-50',
      trend: stats.taxaResolucao >= 80 ? '+5%' : '-2%'
    },
    {
      title: 'Cumprimento SLA',
      value: `${stats.percentualSLA}%`,
      subtitle: stats.slaViolado > 0 ? `${stats.slaViolado} violados` : 'Todos no prazo',
      icon: Target,
      color: stats.percentualSLA >= 90 ? 'text-green-600' : 'text-red-600',
      bg: stats.percentualSLA >= 90 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Satisfação Cliente',
      value: stats.satisfacaoMedia ? `${stats.satisfacaoMedia}⭐` : 'N/A',
      subtitle: stats.satisfacaoMedia ? `${stats.ticketsAvaliados} avaliações` : 'Sem avaliações',
      icon: Star,
      color: stats.satisfacaoMedia >= 4 ? 'text-yellow-600' : 'text-gray-600',
      bg: stats.satisfacaoMedia >= 4 ? 'bg-yellow-50' : 'bg-gray-50'
    },
    {
      title: 'Resolvidos Hoje',
      value: stats.resolvidosHoje,
      subtitle: 'nas últimas 24h',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, idx) => (
        <KPICardItem key={idx} kpi={kpi} />
      ))}
    </div>
  );
}