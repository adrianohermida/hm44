import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useConversasPendentes() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: count = 0 } = useQuery({
    queryKey: ['conversas-pendentes'],
    queryFn: async () => {
      if (user?.role !== 'admin') return 0;
      
      const conversas = await base44.entities.Conversa.filter({
        status: 'aberta'
      });
      
      return conversas.length;
    },
    enabled: !!user && user.role === 'admin',
    refetchInterval: 60000,
    staleTime: 50000
  });

  return count;
}