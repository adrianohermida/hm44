import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useEditarPrazoAprendizado(prazo) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Prazo.update(prazo.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['prazo', prazo.id]);
      toast.success('Prazo atualizado');
    }
  });

  const aprendizadoMutation = useMutation({
    mutationFn: (feedback) =>
      base44.entities.AprendizadoCalculoPrazo.create({
        escritorio_id: prazo.escritorio_id,
        publicacao_id: prazo.publicacao_id,
        sugestao_automatica: {
          tipo_prazo: prazo.tipo_prazo,
          dias: prazo.dias_prazo,
          confianca: prazo.confianca_ia
        },
        confirmacao_usuario: feedback
      }),
    onSuccess: () => toast.success('Feedback registrado para IA')
  });

  return { updateMutation, aprendizadoMutation };
}