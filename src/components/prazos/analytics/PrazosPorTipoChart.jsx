import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function PrazosPorTipoChart({ prazos }) {
  const data = Object.entries(
    prazos.reduce((acc, p) => {
      const tipo = p.tipo || 'outro';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {})
  ).map(([tipo, count]) => ({
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    quantidade: count
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Por Tipo</CardTitle></CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-gray-500">
          Sem dados
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Por Tipo</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}