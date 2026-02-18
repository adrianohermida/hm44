import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TicketMescladoBanner({ ticket, onNavigate }) {
  const { data: ticketPrincipal, isLoading } = useQuery({
    queryKey: ['ticket-principal', ticket.ticket_pai_id],
    queryFn: () => base44.entities.Ticket.filter({ id: ticket.ticket_pai_id }),
    enabled: !!ticket.ticket_pai_id,
    select: (data) => data[0]
  });

  if (!ticket.ticket_pai_id || isLoading) return null;
  if (!ticketPrincipal) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-amber-900">
              Este ticket foi mesclado com:
            </p>
            <button
              onClick={() => onNavigate(ticketPrincipal.id)}
              className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline inline-flex items-center gap-1"
            >
              #{ticketPrincipal.numero_ticket}
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            Mesclado em {format(new Date(ticket.updated_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Todas as mensagens e histórico estão preservados no ticket principal.
          </p>
        </div>
      </div>
    </div>
  );
}