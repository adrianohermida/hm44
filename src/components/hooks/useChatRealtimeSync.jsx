import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useChatRealtimeSync(conversaId, enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !conversaId) return;

    let unsubscribeMensagens = null;
    let unsubscribeConversa = null;

    const start = async () => {
      try {
        // Real-time subscription para mensagens
        unsubscribeMensagens = base44.entities.Mensagem.subscribe((event) => {
          if (event.data?.conversa_id === conversaId) {
            queryClient.invalidateQueries({ 
              queryKey: ['conversa-mensagens', conversaId] 
            });
          }
        });

        // Real-time subscription para conversa (status, etc)
        unsubscribeConversa = base44.entities.Conversa.subscribe((event) => {
          if (event.data?.id === conversaId) {
            queryClient.invalidateQueries({ 
              queryKey: ['conversa', conversaId] 
            });
          }
        });
      } catch (error) {
        console.error('Erro ao setup chat real-time:', error);
      }
    };

    start();

    return () => {
      if (unsubscribeMensagens) unsubscribeMensagens();
      if (unsubscribeConversa) unsubscribeConversa();
    };
  }, [conversaId, enabled, queryClient]);
}