import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export default function UsageMetricsCard({ total, sucesso, falhas, crescimento }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Uso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-[var(--text-secondary)]">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{sucesso}</div>
            <div className="text-xs text-[var(--text-secondary)]">Sucesso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">{falhas}</div>
            <div className="text-xs text-[var(--text-secondary)]">Falhas</div>
          </div>
        </div>
        {crescimento !== undefined && (
          <div className={`text-xs mt-3 flex items-center gap-1 ${crescimento >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {crescimento >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(crescimento)}% vs período anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}