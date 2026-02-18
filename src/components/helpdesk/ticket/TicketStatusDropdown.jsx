import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TicketStatusDropdown({ ticket, onResolve, isPending }) {
  const queryClient = useQueryClient();

  const updateStatus = (newStatus) => {
    base44.entities.Ticket.update(ticket.id, { 
      status: newStatus,
      ultima_atualizacao: new Date().toISOString() 
    }).then(() => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Status atualizado');
    });
  };

  const statusLabels = {
    triagem: 'Triagem',
    aberto: 'Aberto',
    em_atendimento: 'Em Atendimento',
    aguardando_cliente: 'Pendente',
    resolvido: 'Resolvido',
    fechado: 'Fechado'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          disabled={isPending}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white hidden md:flex gap-1"
        >
          {statusLabels[ticket.status]}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateStatus('triagem')}>
          Triagem
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus('aberto')}>
          Aberto
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus('aguardando_cliente')}>
          Pendente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResolve}>
          Resolvido
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus('fechado')}>
          Fechado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}