import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function usePrefetchTicket() {
  const queryClient = useQueryClient();

  const prefetchTicket = (ticketId) => {
    queryClient.prefetchQuery({
      queryKey: ['ticket-mensagens', ticketId],
      queryFn: () => base44.entities.TicketMensagem.filter({ ticket_id: ticketId }),
      staleTime: 5 * 60 * 1000
    });
  };

  return { prefetchTicket };
}