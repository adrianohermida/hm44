import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useRealtimeNotifications(enabled = true) {
  const queryClient = useQueryClient();
  const userEmailRef = useRef(null);
  const lastCheckRef = useRef(localStorage.getItem('last_notification_check'));

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe = null;

    const start = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) return;

        const user = await base44.auth.me();
        if (!user) return;
        userEmailRef.current = user.email;

        // Initialize lastCheck if not set
        if (!lastCheckRef.current) {
          lastCheckRef.current = new Date().toISOString();
          localStorage.setItem('last_notification_check', lastCheckRef.current);
        }

        // Subscribe to real-time notification changes
        unsubscribe = base44.entities.Notificacao.subscribe((event) => {
          if (event.type === 'create' && event.data) {
            const n = event.data;
            // Only show if it's for this user and is new
            if (n.destinatario_email === userEmailRef.current && !n.lida) {
              toast.info(n.titulo, {
                description: n.mensagem,
                action: n.link_acao ? {
                  label: 'Ver',
                  onClick: () => window.location.href = n.link_acao
                } : undefined,
                duration: 5000
              });
            }
          }
          // Always invalidate notifications query on any change
          queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
        });
      } catch (_e) {
        // Fail silently — user may not be authenticated
      }
    };

    start();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient, enabled]);
}