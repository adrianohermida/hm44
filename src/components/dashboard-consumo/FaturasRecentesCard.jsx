import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FaturasRecentesCard({ faturas }) {
  const totalPago = faturas
    .filter(f => f.status === 'PAGO')
    .reduce((acc, f) => acc + f.valor, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Receita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-[var(--text-primary)]">
          R$ {totalPago.toFixed(2)}
        </p>
        <div className="flex gap-2 mt-2">
          {faturas.slice(0, 3).map(f => (
            <Badge key={f.id} variant="outline" className="text-xs">
              {f.status}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}