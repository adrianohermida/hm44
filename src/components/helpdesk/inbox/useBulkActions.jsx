import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useBulkActions(onClearSelection) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async ({ ids, data }) => {
      const updates = ids.map(id => 
        base44.entities.Ticket.update(id, {
          ...data,
          ultima_atualizacao: new Date().toISOString(),
          ...(data.status === 'resolvido' && { tempo_resolucao: new Date().toISOString() })
        })
      );
      await Promise.all(updates);
    },
    onSuccess: async (_, { ids, data }) => {
      await queryClient.invalidateQueries({ queryKey: ['helpdesk-tickets'] });
      await queryClient.invalidateQueries({ queryKey: ['tickets-counts'] });
      await queryClient.invalidateQueries({ queryKey: ['helpdesk-dashboard-tickets'] });
      await queryClient.refetchQueries({ queryKey: ['helpdesk-tickets'] });
      
      const statusLabel = data.status === 'resolvido' ? 'resolvido(s)' : 
                         data.status === 'fechado' ? 'fechado(s)' : 
                         data.status === 'aberto' ? 'aberto(s)' : 'atualizado(s)';
      
      toast.success(`${ids.length} ticket(s) ${statusLabel}`);
      onClearSelection();
    },
    onError: (error) => {
      toast.error('Erro ao atualizar tickets: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map(id => base44.entities.Ticket.delete(id)));
    },
    onSuccess: async (_, ids) => {
      await queryClient.invalidateQueries({ queryKey: ['helpdesk-tickets'] });
      await queryClient.invalidateQueries({ queryKey: ['tickets-counts'] });
      await queryClient.invalidateQueries({ queryKey: ['helpdesk-dashboard-tickets'] });
      await queryClient.refetchQueries({ queryKey: ['helpdesk-tickets'] });
      
      toast.success(`${ids.length} ticket(s) excluído(s)`);
      setShowDeleteDialog(false);
      onClearSelection();
    },
    onError: (error) => {
      toast.error('Erro ao excluir tickets: ' + error.message);
    }
  });

  return {
    updateMutation,
    deleteMutation,
    showDeleteDialog,
    setShowDeleteDialog,
    isLoading: updateMutation.isPending || deleteMutation.isPending
  };
}