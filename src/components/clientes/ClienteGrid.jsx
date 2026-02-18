import React from 'react';
import ClienteCard from './ClienteCard';

export default function ClienteGrid({ clientes, onClienteClick, selectedIds = [], onToggle }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clientes.map(cliente => (
        <ClienteCard 
          key={cliente.id}
          cliente={cliente}
          onClick={() => onClienteClick(cliente.id)}
          selected={selectedIds?.includes(cliente.id)}
          onToggle={onToggle ? () => onToggle(cliente.id) : undefined}
        />
      ))}
    </div>
  );
}