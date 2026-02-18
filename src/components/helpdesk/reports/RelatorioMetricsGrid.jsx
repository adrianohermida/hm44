import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { differenceInMinutes } from 'date-fns';

export default function RelatorioMetricsGrid({ tickets }) {
  const totalTickets = tickets.length;
  const ticketsResolvidos = tickets.filter(t => t.status === 'resolvido' || t.status === 'fechado').length;
  const taxaResolucao = ((ticketsResolvidos / totalTickets) * 100).toFixed(1);
  
  const ticketsComResposta = tickets.filter(t => t.tempo_primeira_resposta);
  const tempoMedioResposta = ticketsComResposta.length > 0
    ? Math.round(ticketsComResposta.reduce((acc, t) => {
        return acc + differenceInMinutes(new Date(t.tempo_primeira_resposta), new Date(t.created_date));
      }, 0) / ticketsComResposta.length)
    : 0;

  const metrics = [
    { label: 'Total de Tickets', value: totalTickets },
    { label: 'Tickets Resolvidos', value: ticketsResolvidos },
    { label: 'Taxa de Resolução', value: `${taxaResolucao}%` },
    { label: 'Tempo Médio Resposta', value: `${tempoMedioResposta}min` }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => (
        <Card key={idx}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{m.value}</p>
            <p className="text-xs text-gray-600">{m.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}