import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PropriedadesEditaveis({ ticket, escritorioId }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    tags: ticket.tags?.join(', ') || '',
    status: ticket.status,
    categoria: ticket.categoria,
    prioridade: ticket.prioridade,
    departamento_id: ticket.departamento_id || '',
    responsavel_email: ticket.responsavel_email || '',
    canal: ticket.canal || ''
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos', escritorioId],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorioId,
      ativo: true 
    }),
    enabled: !!escritorioId
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-team'],
    queryFn: () => base44.entities.User.filter({ role: 'admin' })
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const responsavelAnterior = ticket.responsavel_email;
      
      await base44.entities.Ticket.update(ticket.id, {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        ultima_atualizacao: new Date().toISOString()
      });

      if (data.responsavel_email && data.responsavel_email !== responsavelAnterior) {
        try {
          await base44.functions.invoke('helpdesk/notificarTicketAtribuido', {
            ticket_id: ticket.id,
            responsavel_email: data.responsavel_email,
            escritorio_id: ticket.escritorio_id
          });
        } catch (error) {
          console.error('Erro ao notificar atribuição:', error);
        }
      }

      try {
        await base44.functions.invoke('helpdesk/notificarTicketAtualizado', {
          ticket_id: ticket.id,
          escritorio_id: ticket.escritorio_id
        });
      } catch (error) {
        console.error('Erro ao notificar atualização:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket atualizado');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    }
  });

  const hasChanges = JSON.stringify(formData) !== JSON.stringify({
    tags: ticket.tags?.join(', ') || '',
    status: ticket.status,
    categoria: ticket.categoria,
    prioridade: ticket.prioridade,
    departamento_id: ticket.departamento_id || '',
    responsavel_email: ticket.responsavel_email || '',
    canal: ticket.canal || ''
  });

  return (
    <div className="space-y-4">
      <PropriedadesForm
        formData={formData}
        onChange={setFormData}
        departamentos={departamentos}
        users={users}
      />
      
      <PropriedadesSaveButton
        onClick={() => updateMutation.mutate(formData)}
        disabled={!hasChanges}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}