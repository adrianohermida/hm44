import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useThreadQueries(escritorioId) {
  const conversas = useQuery({
    queryKey: ['conversas', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Conversa.filter({ escritorio_id: escritorioId });
    },
    enabled: !!escritorioId,
    staleTime: 5000
  });

  const tickets = useQuery({
    queryKey: ['tickets', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      return base44.entities.Ticket.filter({ escritorio_id: escritorioId });
    },
    enabled: !!escritorioId,
    staleTime: 5000
  });

  return { conversas, tickets };
}