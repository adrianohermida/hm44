import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Inbox } from 'lucide-react';

export default function AnalyticsKPICards({ kpis }) {
  const cards = [
    {
      title: 'Total de Tickets',
      value: kpis.totalTickets,
      icon: Inbox,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Tickets Abertos',
      value: kpis.ticketsAbertos,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Tickets Resolvidos',
      value: kpis.ticketsResolvidos,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Taxa de Resolução',
      value: `${kpis.taxaResolucao}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Tempo Médio Resposta',
      value: `${kpis.tempoMedioPrimeiraResposta}min`,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-gray-600">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}