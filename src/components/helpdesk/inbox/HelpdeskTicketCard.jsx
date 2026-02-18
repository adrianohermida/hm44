import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function HelpdeskTicketCard({ 
  ticket, 
  isSelected, 
  onSelect, 
  isChecked, 
  onCheck 
}) {
  const statusColors = {
    triagem: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    aberto: 'bg-blue-100 text-blue-800 border-blue-200',
    em_atendimento: 'bg-purple-100 text-purple-800 border-purple-200',
    aguardando_cliente: 'bg-orange-100 text-orange-800 border-orange-200',
    resolvido: 'bg-green-100 text-green-800 border-green-200',
    fechado: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const prioridadeColors = {
    baixa: 'text-gray-600',
    media: 'text-blue-600',
    alta: 'text-orange-600',
    urgente: 'text-red-600'
  };

  const statusIcons = {
    triagem: AlertCircle,
    resolvido: CheckCircle2,
    fechado: CheckCircle2
  };

  const StatusIcon = statusIcons[ticket.status];

  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer transition-all border-l-4",
        isSelected 
          ? "bg-[var(--brand-primary-50)] border-l-[var(--brand-primary)] shadow-sm" 
          : "border-l-transparent hover:border-l-gray-200 hover:shadow-sm"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheck}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-1 flex-1">
              {ticket.titulo || 'Sem título'}
            </h3>
            <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0">
              {moment(ticket.created_date).fromNow()}
            </span>
          </div>

          {ticket.descricao && (
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mb-2">
              {ticket.descricao}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge 
              variant="outline"
              className={cn("text-xs h-5 px-1.5", statusColors[ticket.status] || statusColors.aberto)}
            >
              {ticket.status?.replace('_', ' ')}
            </Badge>
            
            {ticket.prioridade && ticket.prioridade !== 'media' && (
              <Badge 
                variant="outline"
                className={cn("text-xs h-5 px-1.5 border-0", prioridadeColors[ticket.prioridade])}
              >
                {ticket.prioridade}
              </Badge>
            )}
            
            {ticket.cliente_nome && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{ticket.cliente_nome}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}