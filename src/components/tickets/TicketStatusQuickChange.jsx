import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  aberto: { label: 'Aberto', color: 'text-blue-600' },
  em_atendimento: { label: 'Em Atendimento', color: 'text-yellow-600' },
  aguardando_cliente: { label: 'Aguardando', color: 'text-orange-600' },
  resolvido: { label: 'Resolvido', color: 'text-green-600' },
  fechado: { label: 'Fechado', color: 'text-gray-600' }
};

export default function TicketStatusQuickChange({ ticket, compact }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (newStatus) => base44.entities.Ticket.update(ticket.id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(['unified-threads']);
      queryClient.invalidateQueries(['tickets']);
      toast.success('Status atualizado');
    }
  });

  return (
    <Select 
      value={ticket.status} 
      onValueChange={(value) => updateMutation.mutate(value)}
      disabled={updateMutation.isPending}
    >
      <SelectTrigger className={compact ? 'h-7 text-xs w-auto' : 'h-8 text-sm'}>
        <SelectValue>
          <span className={STATUS_CONFIG[ticket.status]?.color}>
            {STATUS_CONFIG[ticket.status]?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            <span className={config.color}>{config.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}