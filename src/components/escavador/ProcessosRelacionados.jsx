import React from 'react';
import { Link2 } from 'lucide-react';

export default function ProcessosRelacionados({ processos }) {
  if (!processos || processos.length === 0) return null;

  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <p className="text-sm font-semibold text-[var(--brand-text-primary)]">Processos Relacionados</p>
      </div>
      <div className="space-y-1">
        {processos.map((p, i) => (
          <p key={i} className="font-mono text-xs text-[var(--brand-text-secondary)]">{p.numero}</p>
        ))}
      </div>
    </div>
  );
}