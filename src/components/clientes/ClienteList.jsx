import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import ClienteListItem from './ClienteListItem';

export default function ClienteList({ clientes, selectedIds, onToggle, onToggleAll, onClienteClick }) {
  const allSelected = selectedIds?.length === clientes?.length && clientes.length > 0;

  return (
    <div className="space-y-2">
      {onToggleAll && (
        <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={onToggleAll}
          />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Selecionar todos ({clientes.length})
          </span>
        </div>
      )}
      {clientes.map(cliente => (
        <ClienteListItem
          key={cliente.id}
          cliente={cliente}
          selected={selectedIds.includes(cliente.id)}
          onToggle={onToggle}
          onClick={() => onClienteClick(cliente.id)}
        />
      ))}
    </div>
  );
}