import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProvedorBulkSelector({ provedores, selected, onToggle, onToggleAll }) {
  const allSelected = provedores.length > 0 && selected.length === provedores.length;

  return (
    <div className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg border">
      <Checkbox 
        checked={allSelected}
        onCheckedChange={onToggleAll}
        aria-label="Selecionar todos"
      />
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {selected.length > 0 ? `${selected.length} selecionados` : 'Selecionar todos'}
      </span>
    </div>
  );
}