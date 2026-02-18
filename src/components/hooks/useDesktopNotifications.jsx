import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useDesktopNotifications(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Pedir permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const { data: user } = useQuery({
    queryKey: ['auth-user-desktop'],
    queryFn: async () => {
      if (!enabled) return null;
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return null;
      return base44.auth.me();
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (!enabled || !user || user.role !== 'admin') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    let errorCount = 0;
    let retryDelay = 60000;
    let interval;
    let isChecking = false;

    const checkMessages = async () => {
      if (isChecking) return;
      isChecking = true;

      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          clearInterval(interval);
          isChecking = false;
          return;
        }

        const conversas = await base44.entities.Conversa.filter({
          status: 'aberta'
        }, '-ultima_atualizacao', 5);

        conversas.forEach(conversa => {
          const lastCheck = localStorage.getItem(`conversa_${conversa.id}_lastCheck`);
          const conversaUpdated = new Date(conversa.ultima_atualizacao).getTime();

          if (!lastCheck || conversaUpdated > parseInt(lastCheck)) {
            new Notification('Nova mensagem no chat', {
              body: `${conversa.cliente_nome}: ${conversa.ultima_mensagem?.substring(0, 50)}...`,
              icon: '/favicon.ico',
              tag: conversa.id
            });

            localStorage.setItem(`conversa_${conversa.id}_lastCheck`, conversaUpdated.toString());
          }
        });
        
        errorCount = 0;
        retryDelay = 60000;
      } catch (error) {
        errorCount++;
        if (error?.response?.status === 429) {
          retryDelay = Math.min(retryDelay * 2, 180000);
          clearInterval(interval);
          interval = setInterval(checkMessages, retryDelay);
        } else if (errorCount >= 3) {
          clearInterval(interval);
        }
      } finally {
        isChecking = false;
      }
    };

    interval = setInterval(checkMessages, retryDelay);
    checkMessages();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, enabled]);

  return {
    isSupported: 'Notification' in window,
    permission: typeof window !== 'undefined' ? Notification.permission : 'default'
  };
}