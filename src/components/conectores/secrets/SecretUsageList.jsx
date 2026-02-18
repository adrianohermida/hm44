import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function SecretUsageList({ provedores = [] }) {
  if (provedores.length === 0) {
    return (
      <p className="text-xs text-[var(--text-tertiary)]">
        Nenhum provedor usando este secret
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <span className="text-xs text-[var(--text-tertiary)]">Usado por:</span>
      {provedores.map((p, i) => (
        <Badge key={i} variant="outline" className="text-xs">
          {p.nome}
        </Badge>
      ))}
    </div>
  );
}