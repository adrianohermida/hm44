import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TicketHistoryItem({ ticket, isCurrentTicket, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isCurrentTicket}
      className={`w-full text-left p-2 rounded border transition-colors ${
        isCurrentTicket
          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 cursor-default'
          : 'border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
          {ticket.titulo}
        </span>
        <Badge variant="outline" className="text-xs">
          {ticket.status}
        </Badge>
      </div>
      <span className="text-xs text-[var(--text-tertiary)]">
        {format(new Date(ticket.created_date), 'dd/MM/yy', { locale: ptBR })}
      </span>
    </button>
  );
}