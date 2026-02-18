import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  pendente: '#f59e0b',
  em_andamento: '#3b82f6',
  cumprido: '#10b981',
  prorrogado: '#8b5cf6',
  perdido: '#ef4444'
};

export default function PrazosPorStatusChart({ prazos }) {
  const data = Object.entries(
    prazos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: status.replace('_', ' '),
    value: count,
    color: COLORS[status]
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Por Status</CardTitle></CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-gray-500">
          Sem dados
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Por Status</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}