import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function ConsumoGlobalCard({ consumos }) {
  const total = consumos.reduce((acc, c) => acc + c.creditos_utilizados, 0);
  const mes = consumos.filter(c => {
    const d = new Date(c.created_date);
    return d.getMonth() === new Date().getMonth();
  }).reduce((acc, c) => acc + c.creditos_utilizados, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Consumo Global
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{total}</p>
        <p className="text-xs text-[var(--text-secondary)]">{mes} este mês</p>
      </CardContent>
    </Card>
  );
}