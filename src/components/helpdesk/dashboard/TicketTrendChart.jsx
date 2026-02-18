import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function TicketTrendChart({ tickets = [], range }) {
  const getDailyData = () => {
    const days = {};
    tickets.forEach(ticket => {
      const date = new Date(ticket.created_date).toISOString().split('T')[0];
      if (!days[date]) {
        days[date] = { date, criados: 0, resolvidos: 0 };
      }
      days[date].criados++;
      if (ticket.status === 'resolvido' && ticket.tempo_resolucao) {
        const resolvidoDate = new Date(ticket.tempo_resolucao).toISOString().split('T')[0];
        if (days[resolvidoDate]) {
          days[resolvidoDate].resolvidos++;
        }
      }
    });

    return Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
  };

  const data = getDailyData();

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendência de Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-sm text-[var(--text-secondary)]">
            Sem dados para o período selecionado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Tendência de Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
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
            />
            <Legend />
            <Bar dataKey="criados" fill="var(--brand-primary)" name="Criados" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolvidos" fill="#10b981" name="Resolvidos" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}