import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProcessoSituacao({ situacoes }) {
  if (!situacoes || situacoes.length === 0) return null;

  return (
    <div className="space-y-2">
      {situacoes.map((sit, idx) => (
        <div key={idx} className="p-2 bg-[var(--brand-bg-secondary)] rounded">
          <Badge variant="outline" className="text-xs mb-1">{sit.nome}</Badge>
          {sit.data && (
            <p className="text-xs text-[var(--brand-text-tertiary)]">
              {format(new Date(sit.data), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          )}
          {sit.detalhe && <p className="text-xs text-[var(--brand-text-secondary)] mt-1">{sit.detalhe}</p>}
        </div>
      ))}
    </div>
  );
}