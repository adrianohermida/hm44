import React from 'react';
import TicketStatus from './TicketStatus';
import TicketPriority from './TicketPriority';
import { format } from 'date-fns';
import { CustomAvatar } from '@/components/ui/CustomAvatar';

export default function TicketCard({ ticket, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-[var(--brand-primary-100)] border-l-4 border-[var(--brand-primary)]' 
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <CustomAvatar
          src={null}
          alt={ticket.cliente_nome}
          fallback={ticket.cliente_nome?.charAt(0) || 'C'}
          className="h-8 w-8 flex-shrink-0"
          fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] text-sm font-semibold"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-[var(--text-primary)] truncate">
              {ticket.titulo}
            </h3>
            <TicketPriority prioridade={ticket.prioridade} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {ticket.descricao}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <TicketStatus status={ticket.status} />
        <span className="text-xs text-[var(--text-tertiary)]">
          {format(new Date(ticket.updated_date), 'dd/MM/yy')}
        </span>
      </div>
    </button>
  );
}