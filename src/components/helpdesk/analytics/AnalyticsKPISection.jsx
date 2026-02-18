import React from 'react';
import { BarChart3, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import HelpdeskKPICard from './HelpdeskKPICard';

export default function AnalyticsKPISection({ kpis }) {
  const kpiCards = [
    { title: "Total de Tickets", value: kpis.totalTickets, subtitle: "no período", icon: BarChart3, color: "blue" },
    { title: "Taxa de Resolução", value: `${kpis.taxaResolucao}%`, subtitle: "tickets resolvidos", icon: CheckCircle, color: "green" },
    { title: "Tempo Médio Resposta", value: `${kpis.tempoMedioResposta}h`, subtitle: "primeira resposta", icon: Clock, color: "orange" },
    { title: "SLA Cumprido", value: `${kpis.taxaSLA}%`, subtitle: "dentro do prazo", icon: TrendingUp, color: "purple" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi, idx) => (
        <HelpdeskKPICard key={idx} kpi={kpi} />
      ))}
    </div>
  );
}