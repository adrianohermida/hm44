import React from 'react';
import { Info } from 'lucide-react';

export default function ProcessoDadoNovo({ tipo, valor }) {
  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg border-l-4 border-l-[var(--brand-info)]">
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 text-[var(--brand-info)]" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-[var(--brand-text-primary)] mb-1">{tipo}</p>
          <p className="text-sm text-[var(--brand-text-secondary)]">{valor}</p>
        </div>
      </div>
    </div>
  );
}