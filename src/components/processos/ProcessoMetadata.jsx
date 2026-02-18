import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProcessoMetadata({ processo }) {
  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Metadados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {processo.valor_causa && (
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Valor da Causa</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(processo.valor_causa)}
            </span>
          </div>
        )}
        {processo.area && (
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Área</span>
            <span className="text-[var(--text-primary)]">{processo.area}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}