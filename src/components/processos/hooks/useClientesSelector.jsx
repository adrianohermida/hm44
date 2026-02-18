import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useClientesSelector() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      return null;
    },
    enabled: !!user
  });

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes-selector', escritorio?.id],
    queryFn: () => base44.entities.Cliente.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  return { clientes, isLoading };
}