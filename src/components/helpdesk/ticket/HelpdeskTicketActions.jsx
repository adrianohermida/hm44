import React from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export default function HelpdeskTicketActions({ ticket }) {
  const queryClient = useQueryClient();

  const atualizarStatusMutation = useMutation({
    mutationFn: (status) => base44.entities.Ticket.update(ticket.id, { 
      status,
      ultima_atualizacao: new Date().toISOString(),
      tempo_resolucao: status === 'resolvido' ? new Date().toISOString() : ticket.tempo_resolucao
    }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      queryClient.invalidateQueries(['dashboard-tickets']);
      queryClient.invalidateQueries(['tickets-counts']);
      queryClient.invalidateQueries(['ticket-messages']);
      toast.success(`Ticket marcado como ${status}`);
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  });

  const triageMutation = useMutation({
    mutationFn: () => base44.functions.invoke('triageIA', { ticket_id: ticket.id }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket classificado pela IA');
    }
  });

  return (
    <div className="flex gap-2 mt-3">
      {ticket.status !== 'resolvido' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => atualizarStatusMutation.mutate('resolvido')}
          disabled={atualizarStatusMutation.isPending}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolver
        </Button>
      )}
      {ticket.status === 'resolvido' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => atualizarStatusMutation.mutate('fechado')}
          disabled={atualizarStatusMutation.isPending}
        >
          <XCircle className="w-3 h-3 mr-1" />
          Fechar
        </Button>
      )}
      {!ticket.departamento_id && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => triageMutation.mutate()}
          disabled={triageMutation.isPending}
        >
          <Zap className="w-3 h-3 mr-1" />
          Classificar IA
        </Button>
      )}
    </div>
  );
}