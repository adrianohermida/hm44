import React from 'react';

const statusConfig = {
  aberto: { label: 'Aberto', color: 'bg-[var(--brand-info)] text-white' },
  pendente: { label: 'Pendente', color: 'bg-[var(--brand-warning)] text-white' },
  resolvido: { label: 'Resolvido', color: 'bg-[var(--brand-success)] text-white' },
  fechado: { label: 'Fechado', color: 'bg-[var(--text-tertiary)] text-white' }
};

export default function TicketStatus({ status }) {
  const config = statusConfig[status] || statusConfig.aberto;
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}