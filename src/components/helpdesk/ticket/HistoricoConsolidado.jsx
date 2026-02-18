import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Mail, 
  MessageSquare, 
  Link2,
  StickyNote,
  Forward,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const eventoConfig = {
  criado: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Criado' },
  resposta_enviada: { icon: Mail, color: 'text-green-600', bg: 'bg-green-50', label: 'Resposta Enviada' },
  resposta_recebida: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Resposta Recebida' },
  nota_interna: { icon: StickyNote, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Nota Interna' },
  encaminhado: { icon: Forward, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Encaminhado' },
  mesclado: { icon: Link2, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Mesclado' },
};

export default function HistoricoConsolidado({ ticketPrincipalId }) {
  const [filtroTicket, setFiltroTicket] = React.useState('todos');

  const { data: ticketsMesclados = [], isLoading: loadingTickets } = useQuery({
    queryKey: ['tickets-mesclados-historico', ticketPrincipalId],
    queryFn: () => base44.entities.Ticket.filter({ ticket_pai_id: ticketPrincipalId }),
    enabled: !!ticketPrincipalId
  });

  const todosTicketsIds = [ticketPrincipalId, ...ticketsMesclados.map(t => t.id)];

  const { data: eventos = [], isLoading: loadingEventos } = useQuery({
    queryKey: ['historico-consolidado', todosTicketsIds, filtroTicket],
    queryFn: async () => {
      const timeline = [];
      const ticketsParaBuscar = filtroTicket === 'todos' 
        ? todosTicketsIds 
        : [filtroTicket];

      for (const ticketId of ticketsParaBuscar) {
        const ticket = await base44.entities.Ticket.filter({ id: ticketId });
        const mensagens = await base44.entities.TicketMensagem.filter({ ticket_id: ticketId });

        if (ticket[0]) {
          timeline.push({
            tipo: 'criado',
            timestamp: ticket[0].created_date,
            ticketNumero: ticket[0].numero_ticket,
            ticketId: ticket[0].id,
            detalhes: `Ticket #${ticket[0].numero_ticket} criado`
          });

          if (ticket[0].ticket_pai_id) {
            timeline.push({
              tipo: 'mesclado',
              timestamp: ticket[0].updated_date,
              ticketNumero: ticket[0].numero_ticket,
              ticketId: ticket[0].id,
              detalhes: `Ticket mesclado ao principal`
            });
          }
        }

        mensagens.forEach(m => {
          if (m.is_internal_note) {
            timeline.push({
              tipo: 'nota_interna',
              timestamp: m.created_date,
              ticketNumero: ticket[0]?.numero_ticket,
              ticketId: ticketId,
              detalhes: `Nota adicionada por ${m.remetente_nome}`
            });
          } else if (m.tipo_remetente === 'cliente') {
            timeline.push({
              tipo: 'resposta_recebida',
              timestamp: m.created_date,
              ticketNumero: ticket[0]?.numero_ticket,
              ticketId: ticketId,
              detalhes: `Resposta recebida de ${m.remetente_nome}`
            });
          } else {
            timeline.push({
              tipo: 'resposta_enviada',
              timestamp: m.created_date,
              ticketNumero: ticket[0]?.numero_ticket,
              ticketId: ticketId,
              detalhes: `Resposta enviada por ${m.remetente_nome}`
            });
          }
        });
      }

      return timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    enabled: !!ticketPrincipalId && todosTicketsIds.length > 0
  });

  if (loadingTickets || loadingEventos) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Filtrar por ticket:
        </label>
        <Select value={filtroTicket} onValueChange={setFiltroTicket}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tickets</SelectItem>
            <SelectItem value={ticketPrincipalId}>Ticket Principal</SelectItem>
            {ticketsMesclados.map(t => (
              <SelectItem key={t.id} value={t.id}>
                #{t.numero_ticket}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
        {eventos.map((evento, idx) => {
          const config = eventoConfig[evento.tipo] || eventoConfig.criado;
          const Icon = config.icon;

          return (
            <div key={idx} className="flex gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {evento.detalhes}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {format(new Date(evento.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  {evento.ticketNumero && (
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      #{evento.ticketNumero}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {eventos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Nenhum evento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}