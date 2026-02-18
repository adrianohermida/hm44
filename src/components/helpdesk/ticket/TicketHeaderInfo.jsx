import React from 'react';
import { User } from 'lucide-react';

export default function TicketHeaderInfo({ ticket, clienteNome }) {
  return (
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
        {ticket.titulo}
      </h2>
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <User className="w-3 h-3" />
        <span>{clienteNome}</span>
      </div>
    </div>
  );
}