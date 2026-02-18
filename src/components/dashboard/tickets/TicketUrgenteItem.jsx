import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TicketUrgenteItem({ ticket, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {ticket.titulo}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {ticket.cliente_nome || ticket.cliente_email}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-orange-600">
              {formatDistanceToNow(new Date(ticket.created_date), { locale: ptBR, addSuffix: true })}
            </span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}