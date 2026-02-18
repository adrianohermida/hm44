import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useAtendimentoMutations() {
  const queryClient = useQueryClient();
  
  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Atendimento.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['atendimentos']);
      toast.success('Atendimento atualizado');
    }
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.Atendimento.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['atendimentos']);
      toast.success('Atendimento removido');
    }
  });

  return { update, remove };
}