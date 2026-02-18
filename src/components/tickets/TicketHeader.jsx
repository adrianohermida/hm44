import React from 'react';
import TicketStatus from './TicketStatus';
import TicketPriority from './TicketPriority';

export default function TicketHeader({ ticket }) {
  return (
    <div className="p-4 border-b border-[var(--border-primary)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="font-semibold text-[var(--text-primary)]">{ticket.titulo}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{ticket.descricao}</p>
        </div>
        <div className="flex items-center gap-2">
          <TicketPriority prioridade={ticket.prioridade} />
          <TicketStatus status={ticket.status} />
        </div>
      </div>
    </div>
  );
}