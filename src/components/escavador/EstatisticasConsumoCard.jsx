import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function EstatisticasConsumoCard({ stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Estatísticas de Consumo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Total de Créditos</span>
            <span className="font-bold">{stats.total_creditos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Requisições</span>
            <span className="font-bold">{stats.total_requisicoes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Taxa de Sucesso</span>
            <span className="font-bold text-[var(--brand-success)]">{stats.sucesso_rate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}