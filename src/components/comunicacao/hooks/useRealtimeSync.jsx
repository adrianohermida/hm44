import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useRealtimeSync(threadId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!threadId) return;

    const unsubscribe = base44.agents.subscribeToConversation?.(threadId, () => {
      queryClient.invalidateQueries(['unified-threads']);
      queryClient.invalidateQueries(['mensagens', threadId]);
    });

    return () => unsubscribe?.();
  }, [threadId, queryClient]);
}