import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function SLAEvolutionChart({ tickets = [] }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const data = last7Days.map(date => {
    const ticketsDia = tickets.filter(t => t.created_date?.startsWith(date));
    const comSLA = ticketsDia.filter(t => t.tempo_primeira_resposta);
    const violados = comSLA.filter(t => {
      const criado = new Date(t.created_date);
      const respondido = new Date(t.tempo_primeira_resposta);
      const horas = (respondido - criado) / (1000 * 60 * 60);
      return horas > (t.sla_definido_horas || 24);
    }).length;

    const percentual = comSLA.length > 0
      ? Math.round(((comSLA.length - violados) / comSLA.length) * 100)
      : 100;

    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      sla: percentual,
      total: comSLA.length
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          Evolução SLA (7 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} style={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="sla" stroke="#10b981" strokeWidth={2} name="SLA %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}