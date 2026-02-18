import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

export default function ResponseTimeChart({ tickets = [] }) {
  const getResponseTimeData = () => {
    const ticketsComResposta = tickets.filter(t => t.tempo_primeira_resposta);
    
    if (ticketsComResposta.length === 0) return [];

    const dailyTimes = {};
    ticketsComResposta.forEach(ticket => {
      const date = new Date(ticket.created_date).toISOString().split('T')[0];
      const criado = new Date(ticket.created_date);
      const respondido = new Date(ticket.tempo_primeira_resposta);
      const minutos = (respondido - criado) / (1000 * 60);

      if (!dailyTimes[date]) {
        dailyTimes[date] = { date, tempos: [] };
      }
      dailyTimes[date].tempos.push(minutos);
    });

    return Object.entries(dailyTimes).map(([date, { tempos }]) => ({
      date,
      media: Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const data = getResponseTimeData();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tempo de Resposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-sm text-[var(--text-secondary)]">
            Sem dados de tempo de resposta
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Tempo Médio de Resposta (minutos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              stroke="var(--text-tertiary)"
            />
            <YAxis stroke="var(--text-tertiary)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-elevated)', 
                border: '1px solid var(--border-primary)',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value}min`, 'Tempo Médio']}
            />
            <Line 
              type="monotone" 
              dataKey="media" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}