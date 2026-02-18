import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useLeadMagnets(status = 'ativo') {
  const { data: magnets = [] } = useQuery({
    queryKey: ['lead-magnets', status],
    queryFn: () => base44.entities.LeadMagnet.filter({ status }, 'ordem_exibicao', 20)
  });

  return { magnets };
}