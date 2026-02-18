import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Link2, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  triagem: { label: 'Triagem', color: 'bg-orange-100 text-orange-700' },
  aberto: { label: 'Aberto', color: 'bg-blue-100 text-blue-700' },
  em_atendimento: { label: 'Em Atendimento', color: 'bg-purple-100 text-purple-700' },
  aguardando_cliente: { label: 'Aguardando Cliente', color: 'bg-yellow-100 text-yellow-700' },
  resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-700' },
  fechado: { label: 'Fechado', color: 'bg-gray-100 text-gray-700' }
};

export default function TicketsMescladosPanel({ ticketId, onNavigate }) {
  const { data: ticketsMesclados = [], isLoading } = useQuery({
    queryKey: ['tickets-mesclados', ticketId],
    queryFn: () => base44.entities.Ticket.filter({ ticket_pai_id: ticketId }),
    enabled: !!ticketId
  });

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (ticketsMesclados.length === 0) {
    return (
      <div className="p-6 text-center">
        <Link2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Sem Tickets Mesclados
        </p>
        <p className="text-xs text-gray-500">
          Este ticket ainda não possui outros tickets mesclados a ele.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          Tickets Mesclados ({ticketsMesclados.length})
        </h3>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {ticketsMesclados.map((ticket) => {
          const status = statusConfig[ticket.status] || statusConfig.aberto;
          
          return (
            <div
              key={ticket.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-gray-500 mb-1">
                    #{ticket.numero_ticket}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {ticket.titulo}
                  </h4>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onNavigate(ticket.id)}
                  className="flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                  {status.label}
                </span>
                {ticket.prioridade && (
                  <span className="text-xs text-gray-500">
                    {ticket.prioridade}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div>
                  <strong>Cliente:</strong> {ticket.cliente_nome}
                </div>
                <div>
                  <strong>Mesclado:</strong> {format(new Date(ticket.updated_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}