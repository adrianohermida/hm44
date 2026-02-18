import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function SelectAllBar({ total, selected, onToggleAll }) {
  const allSelected = selected === total && total > 0;
  const someSelected = selected > 0 && selected < total;

  return (
    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg">
      <Checkbox 
        checked={allSelected}
        indeterminate={someSelected}
        onCheckedChange={onToggleAll}
      />
      <span className="text-xs md:text-sm text-[var(--text-secondary)]">
        {allSelected ? `Todos ${total} processos selecionados` : `${selected} de ${total} selecionados`}
      </span>
    </div>
  );
}