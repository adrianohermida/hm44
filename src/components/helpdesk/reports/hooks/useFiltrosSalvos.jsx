import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useFiltrosSalvos() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: filtros = [], isLoading } = useQuery({
    queryKey: ['filtros-salvos', user?.email],
    queryFn: () => base44.entities.FiltroSalvo.filter({ 
      user_email: user.email, 
      tipo: 'relatorio' 
    }),
    enabled: !!user?.email
  });

  const favoritarMutation = useMutation({
    mutationFn: (filtro) => base44.entities.FiltroSalvo.update(filtro.id, { 
      favorito: !filtro.favorito 
    }),
    onSuccess: () => queryClient.invalidateQueries(['filtros-salvos'])
  });

  const deletarMutation = useMutation({
    mutationFn: (id) => base44.entities.FiltroSalvo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos']);
      toast.success('Filtro removido');
    }
  });

  return {
    filtros: filtros.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0)),
    isLoading,
    favoritar: favoritarMutation.mutate,
    deletar: deletarMutation.mutate
  };
}