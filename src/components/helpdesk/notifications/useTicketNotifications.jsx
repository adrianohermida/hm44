import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useTicketNotifications(enabled = true, escritorioId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !escritorioId) return;

    let unsubscribe = null;
    let pollInterval = null;
    const processedNotifications = new Set();

    const setupRealTime = async () => {
      try {
        // Real-time subscriptions para Ticket e Notificacao
        unsubscribe = base44.entities.Ticket.subscribe((event) => {
          if (event.data?.escritorio_id === escritorioId) {
            const notificacao = event.data;
            const notifId = `${event.type}-${notificacao.id}`;
            
            if (!processedNotifications.has(notifId)) {
              processedNotifications.add(notifId);
              
              const toastType = notificacao.prioridade === 'urgente' ? 'error' : 'info';
              const toastFn = toast[toastType];
              
              toastFn(`Ticket ${event.type}`, {
                description: `${notificacao.titulo} - Prioridade: ${notificacao.prioridade}`,
                duration: 6000,
              });
            }
            
            queryClient.invalidateQueries({ queryKey: ['tickets', escritorioId] });
          }
        });
      } catch (error) {
        console.warn('Real-time falhou, usando polling:', error);
        fallbackPolling();
      }
    };

    const fallbackPolling = () => {
      pollInterval = setInterval(async () => {
        try {
          const user = await base44.auth.me();
          if (!user) return;

          const tickets = await base44.entities.Ticket.filter({
            escritorio_id: escritorioId,
            status: { $in: ['aberto', 'em_atendimento'] }
          }, '-updated_date', 50);

          const unreadCount = tickets.filter(t => !t.lida).length;
          queryClient.setQueryData(['ticket-notifications-unread'], unreadCount);
        } catch (error) {
          console.error('Polling erro:', error);
        }
      }, 30000);
    };

    setupRealTime();

    return () => {
      if (unsubscribe) unsubscribe();
      if (pollInterval) clearInterval(pollInterval);
      processedNotifications.clear();
    };
  }, [queryClient, enabled, escritorioId]);
}