import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConsumoAPIChart({ dados }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="creditos" fill="var(--brand-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}