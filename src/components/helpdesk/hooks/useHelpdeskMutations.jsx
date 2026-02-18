import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useHelpdeskMutations(selectedIds, setSelectedIds, escritorioId) {
  const queryClient = useQueryClient();

  const resolverMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        selectedIds.map(id =>
          base44.entities.Ticket.update(id, {
            status: 'resolvido',
            tempo_resolucao: new Date().toISOString(),
            ultima_atualizacao: new Date().toISOString()
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      queryClient.invalidateQueries(['helpdesk-tickets-bulk']);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} tickets resolvidos`);
    },
    onError: (error) => toast.error('Erro ao resolver tickets: ' + error.message)
  });

  const excluirMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        selectedIds.map(id => base44.entities.Ticket.delete(id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      queryClient.invalidateQueries(['helpdesk-tickets-bulk']);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} tickets excluídos`);
    },
    onError: (error) => toast.error('Erro ao excluir tickets: ' + error.message)
  });

  const mesclarMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('mesclarTickets', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      setSelectedIds([]);
      toast.success('Tickets mesclados com sucesso');
    },
    onError: (error) => toast.error('Erro ao mesclar: ' + error.message)
  });

  const encaminharMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('encaminharTicket', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      setSelectedIds([]);
      toast.success('Ticket encaminhado');
    },
    onError: (error) => toast.error('Erro ao encaminhar: ' + error.message)
  });

  const atualizarMassaMutation = useMutation({
    mutationFn: async (updates) => {
      await Promise.all(
        selectedIds.map(async (id) => {
          await base44.entities.Ticket.update(id, {
            ...updates,
            ultima_atualizacao: new Date().toISOString()
          });
          
          if (updates.responsavel_email) {
            try {
              await base44.functions.invoke('helpdesk/notificarTicketAtribuido', {
                ticket_id: id,
                responsavel_email: updates.responsavel_email,
                escritorio_id: escritorioId
              });
            } catch (error) {
              console.error('Erro ao notificar atribuição:', error);
            }
          }
        })
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['helpdesk-tickets']);
      await queryClient.invalidateQueries(['helpdesk-tickets-bulk']);
      await queryClient.refetchQueries(['helpdesk-tickets']);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} tickets atualizados`);
    },
    onError: (error) => toast.error('Erro: ' + error.message)
  });

  return {
    resolverMutation,
    excluirMutation,
    mesclarMutation,
    encaminharMutation,
    atualizarMassaMutation
  };
}