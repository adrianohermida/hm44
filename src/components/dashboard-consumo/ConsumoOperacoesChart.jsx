import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConsumoOperacoesChart({ consumos }) {
  const ops = consumos.reduce((acc, c) => {
    acc[c.operacao] = (acc[c.operacao] || 0) + c.creditos_utilizados;
    return acc;
  }, {});

  const data = Object.entries(ops).map(([op, val]) => ({ operacao: op, creditos: val }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Consumo por Operação</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="operacao" stroke="var(--text-tertiary)" />
            <YAxis stroke="var(--text-tertiary)" />
            <Tooltip />
            <Bar dataKey="creditos" fill="var(--brand-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}