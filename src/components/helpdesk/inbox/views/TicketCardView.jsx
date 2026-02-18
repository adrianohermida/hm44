import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle, CheckCircle, Inbox, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

const statusColors = {
  triagem: 'bg-purple-100 text-purple-700',
  aberto: 'bg-blue-100 text-blue-700',
  em_atendimento: 'bg-yellow-100 text-yellow-700',
  aguardando_cliente: 'bg-orange-100 text-orange-700',
  resolvido: 'bg-green-100 text-green-700',
  fechado: 'bg-gray-100 text-gray-700'
};

const prioridadeColors = {
  baixa: 'bg-green-500',
  media: 'bg-blue-500',
  alta: 'bg-orange-500',
  urgente: 'bg-red-500'
};

export default function TicketCardView({ tickets, selectedTicket, onSelectTicket, selectedIds, onToggleSelect }) {
  return (
    <div className="grid gap-3 p-4">
      {tickets.map((ticket, index) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
        >
          <Card
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
              selectedTicket?.id === ticket.id && "ring-2 ring-[var(--brand-primary)] shadow-md"
            )}
            onClick={() => onSelectTicket(ticket)}
          >
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Checkbox
                checked={selectedIds.includes(ticket.id)}
                onCheckedChange={() => onToggleSelect(ticket.id)}
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <div className={cn("w-1 h-1 rounded-full mt-2", prioridadeColors[ticket.prioridade])} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={statusColors[ticket.status]}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">#{ticket.numero_ticket}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{ticket.titulo}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{ticket.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {ticket.cliente_nome || ticket.cliente_email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(ticket.created_date), "dd MMM", { locale: ptBR })}
                  </div>
                  {ticket.responsavel_email && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {ticket.responsavel_email.split('@')[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      ))}
    </div>
  );
}