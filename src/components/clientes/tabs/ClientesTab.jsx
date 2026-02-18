import React from 'react';
import ClienteGrid from '../ClienteGrid';
import ClienteList from '../ClienteList';
import ClienteEmptyState from '../ClienteEmptyState';

export default function ClientesTab({ clientes, viewMode, onClienteClick, onNovoCliente, selectedIds, onToggle, onToggleAll }) {
  if (clientes.length === 0) {
    return <ClienteEmptyState onNovoCliente={onNovoCliente} temBusca={false} />;
  }

  return (
    <div className="space-y-4">
      {viewMode === 'cards' ? (
        <ClienteGrid 
          clientes={clientes} 
          onClienteClick={onClienteClick}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ) : (
        <ClienteList 
          clientes={clientes}
          selectedIds={selectedIds}
          onToggle={onToggle}
          onToggleAll={onToggleAll}
          onClienteClick={onClienteClick}
        />
      )}
    </div>
  );
}