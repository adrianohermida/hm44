import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useEscritorio() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  return useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios || escritorios.length === 0) {
        throw new Error('Nenhum escritório encontrado');
      }
      return escritorios[0];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });
}