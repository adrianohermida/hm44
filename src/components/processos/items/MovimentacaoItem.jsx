import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export default function MovimentacaoItem({ movimentacao }) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {movimentacao.data ? new Date(movimentacao.data).toLocaleDateString('pt-BR') : 'Data não informada'}
          </span>
        </div>
        {movimentacao.fonte && (
          <Badge variant="outline" className="text-xs">{movimentacao.fonte}</Badge>
        )}
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        {movimentacao.titulo || movimentacao.descricao || 'Sem descrição'}
      </p>
    </Card>
  );
}