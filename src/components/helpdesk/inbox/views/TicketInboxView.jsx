import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MoreVertical, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors = {
  triagem: 'bg-purple-100 text-purple-700',
  aberto: 'bg-blue-100 text-blue-700',
  em_atendimento: 'bg-yellow-100 text-yellow-700',
  aguardando_cliente: 'bg-orange-100 text-orange-700',
  resolvido: 'bg-green-100 text-green-700',
  fechado: 'bg-gray-100 text-gray-700'
};

const prioridadeColors = {
  baixa: 'border-green-500',
  media: 'border-blue-500',
  alta: 'border-orange-500',
  urgente: 'border-red-500'
};

export default function TicketInboxView({ tickets, selectedTicket, onSelectTicket, selectedIds, onToggleSelect, onClassificar }) {
  return (
    <div className="divide-y divide-[var(--border-primary)]">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className={cn(
            "flex items-center gap-3 p-3 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors border-l-4",
            prioridadeColors[ticket.prioridade],
            selectedTicket?.id === ticket.id && "bg-[var(--bg-secondary)]"
          )}
          onClick={() => onSelectTicket(ticket)}
        >
          <Checkbox
            checked={selectedIds.includes(ticket.id)}
            onCheckedChange={() => onToggleSelect(ticket.id)}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">#{ticket.numero_ticket}</span>
              <Badge variant="outline" className={cn("text-xs", statusColors[ticket.status])}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <h3 className="font-medium text-sm truncate mb-1">{ticket.titulo}</h3>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{ticket.cliente_nome || ticket.cliente_email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(ticket.created_date), "dd/MM", { locale: ptBR })}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onClassificar?.(ticket)}>
                <Bot className="w-4 h-4 mr-2" />
                Classificar IA
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}