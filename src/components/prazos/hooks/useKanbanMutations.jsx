import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useKanbanMutations() {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status_kanban, ordem_kanban }) =>
      base44.entities.Prazo.update(id, { status_kanban, ordem_kanban }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prazos-kanban']);
      toast.success('Prazo atualizado');
    },
    onError: () => toast.error('Erro ao atualizar prazo')
  });

  const updateOrdemMutation = useMutation({
    mutationFn: ({ id, ordem_kanban }) =>
      base44.entities.Prazo.update(id, { ordem_kanban }),
    onSuccess: () => {
      queryClient.invalidateQueries(['prazos-kanban']);
    }
  });

  return { updateStatusMutation, updateOrdemMutation };
}