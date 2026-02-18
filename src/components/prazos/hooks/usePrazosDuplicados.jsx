import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function usePrazosDuplicados() {
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: prazos, isLoading } = useQuery({
    queryKey: ['prazos-duplicados'],
    queryFn: () => base44.entities.Prazo.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const detectarDuplicados = () => {
    if (!prazos) return [];
    const grupos = {};
    prazos.forEach(p => {
      const key = `${p.processo_id}-${p.titulo}-${p.data_vencimento}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(p);
    });
    return Object.values(grupos).filter(g => g.length > 1);
  };

  const mesclarMutation = useMutation({
    mutationFn: async ({ manter, excluir }) => {
      await Promise.all(excluir.map(id => base44.entities.Prazo.delete(id)));
      return manter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['prazos-duplicados']);
      toast.success('Prazos mesclados');
    }
  });

  return { duplicados: detectarDuplicados(), isLoading, mesclarMutation };
}