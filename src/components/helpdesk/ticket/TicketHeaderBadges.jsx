import React from 'react';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  aberto: 'bg-blue-100 text-blue-700',
  em_atendimento: 'bg-yellow-100 text-yellow-700',
  aguardando_cliente: 'bg-orange-100 text-orange-700',
  resolvido: 'bg-green-100 text-green-700',
  fechado: 'bg-gray-100 text-gray-700'
};

export default function TicketHeaderBadges({ ticket }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge className={statusColors[ticket.status]}>
        {ticket.status}
      </Badge>
      {ticket.prioridade && (
        <Badge variant="outline">
          {ticket.prioridade}
        </Badge>
      )}
      {ticket.tags?.map(tag => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}