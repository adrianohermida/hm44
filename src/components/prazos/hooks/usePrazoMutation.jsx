import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function usePrazoMutation(prazo, onSuccess) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      if (prazo?.id) {
        return base44.entities.Prazo.update(prazo.id, data);
      }
      return base44.entities.Prazo.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['prazos']);
      toast.success(prazo ? 'Prazo atualizado' : 'Prazo criado');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao salvar prazo');
    }
  });
}