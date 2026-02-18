import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { reportCustomError } from '@/components/debug/ErrorLogger';

export function useProcessosActions(escritorioId) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Processo.create({ 
      ...data, 
      escritorio_id: escritorioId 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['processos']);
      toast.success('Processo criado com sucesso!');
    },
    onError: (error) => {
      reportCustomError('Erro ao criar processo', 'ENTITIES', error.stack, { escritorioId });
      toast.error('Erro ao criar processo');
    }
  });

  const bulkArchive = async (processos) => {
    try {
      for (const p of processos) {
        await base44.entities.Processo.update(p.id, { status: 'arquivado' });
      }
    } catch (error) {
      reportCustomError('Erro ao arquivar processos em lote', 'ENTITIES', error.stack, { count: processos.length });
      throw error;
    }
  };

  const bulkDelete = async (processos) => {
    try {
      for (const p of processos) {
        await base44.entities.Processo.delete(p.id);
      }
    } catch (error) {
      reportCustomError('Erro ao excluir processos em lote', 'ENTITIES', error.stack, { count: processos.length });
      throw error;
    }
  };

  return { createMutation, bulkArchive, bulkDelete };
}