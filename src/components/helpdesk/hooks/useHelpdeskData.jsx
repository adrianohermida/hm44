import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { helpdeskCacheConfig } from '../performance/HelpdeskCacheConfig';

export function useHelpdeskData() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio, isLoading: loadingEscritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      if (!result || result.length === 0) {
        throw new Error('Nenhum escritório encontrado');
      }
      return result[0];
    },
    enabled: !!user,
    retry: 2,
    ...helpdeskCacheConfig.departamentos
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['helpdesk-tickets-bulk', escritorio?.id],
    queryFn: () => base44.entities.Ticket.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio?.id
  });

  return {
    user,
    escritorio,
    tickets,
    isLoading: loadingUser || loadingEscritorio
  };
}