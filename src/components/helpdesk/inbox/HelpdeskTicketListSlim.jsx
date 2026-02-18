import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock } from 'lucide-react';

export default function HelpdeskTicketListSlim({ 
  filtros, 
  escritorioId, 
  ticketSelecionado, 
  onSelectTicket 
}) {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['helpdesk-tickets-slim', escritorioId, JSON.stringify(filtros)],
    queryFn: async () => {
      if (!escritorioId) return [];
      let query = { escritorio_id: escritorioId };

      if (filtros.status && filtros.status !== 'todos') {
        const statusArray = filtros.status.split(',').map(s => s.trim());
        query.status = statusArray.length === 1 ? statusArray[0] : { $in: statusArray };
      }

      if (filtros.prioridade && filtros.prioridade !== 'todos') {
        query.prioridade = filtros.prioridade;
      }

      if (filtros.departamento && filtros.departamento !== 'todos') {
        query.departamento_id = filtros.departamento;
      }

      if (filtros.responsavel === 'meus') {
        const user = await base44.auth.me();
        query.responsavel_email = user.email;
      } else if (filtros.responsavel && filtros.responsavel !== 'todos') {
        query.responsavel_email = filtros.responsavel;
      }

      if (filtros.created_by) query.created_by = filtros.created_by;
      if (filtros.is_spam !== undefined) query.is_spam = filtros.is_spam;
      if (filtros.arquivado !== undefined) query.arquivado = filtros.arquivado;

      return base44.entities.Ticket.filter(query, '-ultima_atualizacao', 200);
    },
    enabled: !!escritorioId,
    refetchInterval: 5000
  });

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getPriorityColor = (prioridade) => {
    switch(prioridade) {
      case 'urgente': return 'bg-red-100 text-red-700';
      case 'alta': return 'bg-orange-100 text-orange-700';
      case 'media': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-[var(--border-primary)]">
        {tickets.map(ticket => {
          const isSelected = ticketSelecionado?.id === ticket.id;
          const isVencido = ticket.data_vencimento_sla && 
            new Date(ticket.data_vencimento_sla) < new Date() && 
            !['resolvido', 'fechado'].includes(ticket.status);

          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={cn(
                "p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                isSelected && "bg-blue-50 border-l-4 border-l-blue-600"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {getInitials(ticket.cliente_nome)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {ticket.cliente_nome}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDistanceToNow(new Date(ticket.created_date), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {ticket.titulo}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isVencido && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Vencido
                      </Badge>
                    )}
                    {ticket.prioridade !== 'baixa' && (
                      <Badge className={cn("text-xs px-1.5 py-0 h-5", getPriorityColor(ticket.prioridade))}>
                        {ticket.prioridade}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {tickets.length === 0 && (
          <div className="p-8 text-center">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhum ticket encontrado</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}