import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Sincronização real-time para Helpdesk
 * Subscriptions em: Ticket, TicketMensagem, Tarefa
 */
export function useHelpdeskRealtimeSync(escritorioId, enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !escritorioId) return;

    const unsubscribers = [];

    const startSubscriptions = async () => {
      try {
        // Tickets em tempo real
        unsubscribers.push(
          base44.entities.Ticket.subscribe((event) => {
            if (event.data?.escritorio_id === escritorioId) {
              queryClient.invalidateQueries({ 
                queryKey: ['tickets', escritorioId] 
              });
            }
          })
        );

        // Mensagens de ticket
        unsubscribers.push(
          base44.entities.TicketMensagem.subscribe((event) => {
            if (event.data?.escritorio_id === escritorioId) {
              queryClient.invalidateQueries({ 
                queryKey: ['ticket-mensagens', event.data.ticket_id] 
              });
            }
          })
        );

        // Tarefas
        unsubscribers.push(
          base44.entities.Tarefa.subscribe((event) => {
            if (event.data?.escritorio_id === escritorioId) {
              queryClient.invalidateQueries({ 
                queryKey: ['tarefas', escritorioId] 
              });
            }
          })
        );
      } catch (error) {
        console.error('Erro ao setup helpdesk real-time:', error);
      }
    };

    startSubscriptions();

    return () => {
      unsubscribers.forEach(u => { if (u) u(); });
    };
  }, [escritorioId, enabled, queryClient]);
}