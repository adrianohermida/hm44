import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TicketsPorCanalChart({ tickets = [] }) {
  const hoje = new Date();
  const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

  const ticketsUltimos7Dias = tickets.filter(t => {
    const criado = new Date(t.created_date);
    return criado >= seteDiasAtras;
  });

  const canais = ['email', 'chat', 'whatsapp', 'telefone'];
  const data = canais.map(canal => ({
    canal: canal.charAt(0).toUpperCase() + canal.slice(1),
    total: ticketsUltimos7Dias.filter(t => t.canal === canal).length
  }));

  if (data.every(d => d.total === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tickets por Canal (7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-sm text-[var(--text-tertiary)]">
            Nenhum ticket nos últimos 7 dias
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tickets por Canal (7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis dataKey="canal" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-elevated)', 
                border: '1px solid var(--border-primary)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="total" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}