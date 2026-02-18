import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const statusColors = {
  triagem: 'bg-purple-100 text-purple-700',
  aberto: 'bg-blue-100 text-blue-700',
  em_atendimento: 'bg-yellow-100 text-yellow-700',
  aguardando_cliente: 'bg-orange-100 text-orange-700',
  resolvido: 'bg-green-100 text-green-700',
  fechado: 'bg-gray-100 text-gray-700'
};

const prioridadeIcons = {
  baixa: '●',
  media: '●',
  alta: '●',
  urgente: '●'
};

const prioridadeColors = {
  baixa: 'text-green-500',
  media: 'text-blue-500',
  alta: 'text-orange-500',
  urgente: 'text-red-500'
};

export default function TicketTableView({ tickets, selectedTicket, onSelectTicket, selectedIds, onToggleSelect }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
          <tr>
            <th className="p-3 text-left w-10">
              <Checkbox />
            </th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Contato</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Assunto</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Estado</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Grupo</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Agente</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600 w-10">P</th>
            <th className="p-3 text-left text-xs font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-primary)]">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className={cn(
                "hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors",
                selectedTicket?.id === ticket.id && "bg-[var(--bg-secondary)]"
              )}
              onClick={() => onSelectTicket(ticket)}
            >
              <td className="p-3">
                <Checkbox
                  checked={selectedIds.includes(ticket.id)}
                  onCheckedChange={() => onToggleSelect(ticket.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-3">
                <div className="text-sm font-medium truncate max-w-[150px]">
                  {ticket.cliente_nome || ticket.cliente_email?.split('@')[0]}
                </div>
              </td>
              <td className="p-3">
                <div className="text-sm truncate max-w-[300px]">
                  {ticket.titulo} <span className="text-gray-500">#{ticket.numero_ticket}</span>
                </div>
              </td>
              <td className="p-3">
                <Badge className={statusColors[ticket.status]} variant="secondary">
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-3 text-sm text-gray-600">
                {ticket.departamento_id || '--'}
              </td>
              <td className="p-3 text-sm text-gray-600">
                {ticket.responsavel_email?.split('@')[0] || '--'}
              </td>
              <td className="p-3">
                <span className={cn("text-lg", prioridadeColors[ticket.prioridade])}>
                  {prioridadeIcons[ticket.prioridade]}
                </span>
              </td>
              <td className="p-3 text-xs text-gray-500">
                {ticket.status === 'triagem' ? 'Triagem' :
                 ticket.status === 'aberto' ? 'Aberto' : 
                 ticket.status === 'resolvido' ? 'Resolvido' : 
                 ticket.status === 'fechado' ? 'Fechado' : 'Em andamento'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}