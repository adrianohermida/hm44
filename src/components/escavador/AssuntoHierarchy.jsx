import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function AssuntoHierarchy({ assunto }) {
  if (!assunto) return null;

  const parts = assunto.path_completo.split('|').map(p => p.trim());

  return (
    <div className="flex items-center gap-1 flex-wrap text-xs">
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          <span className={i === parts.length - 1 ? 'font-semibold text-[var(--brand-primary)]' : 'text-[var(--brand-text-tertiary)]'}>
            {part}
          </span>
          {i < parts.length - 1 && <ChevronRight className="w-3 h-3 text-[var(--brand-text-tertiary)]" />}
        </React.Fragment>
      ))}
    </div>
  );
}