import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

export default function ConsumoAPICard({ creditosUsados, limiteCreditos }) {
  const percentual = (creditosUsados / limiteCreditos) * 100;
  const cor = percentual > 80 ? 'destructive' : percentual > 50 ? 'warning' : 'default';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Consumo Mensal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{creditosUsados}</span>
          <Badge variant={cor}>
            {percentual.toFixed(0)}%
          </Badge>
        </div>
        <Progress value={percentual} className="h-2" />
        <p className="text-sm text-[var(--text-secondary)]">
          Limite: {limiteCreditos} créditos/mês
        </p>
      </CardContent>
    </Card>
  );
}