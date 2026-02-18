import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useNotifications() {
  const queryClient = useQueryClient();

  const { data: notificacoes = [], isLoading } = useQuery({
    queryKey: ['notificacoes'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Notificacao.filter({
        destinatario_email: user.email,
        lida: false
      }, '-created_date', 20);
    },
    refetchInterval: 10000
  });

  const marcarLidaMutation = useMutation({
    mutationFn: (id) => base44.entities.Notificacao.update(id, { lida: true }),
    onSuccess: () => queryClient.invalidateQueries(['notificacoes'])
  });

  const marcarTodasLidas = useMutation({
    mutationFn: async () => {
      const updates = notificacoes.map(n => 
        base44.entities.Notificacao.update(n.id, { lida: true })
      );
      await Promise.all(updates);
    },
    onSuccess: () => queryClient.invalidateQueries(['notificacoes'])
  });

  return {
    notificacoes,
    isLoading,
    naoLidas: notificacoes.length,
    marcarLida: marcarLidaMutation.mutate,
    marcarTodasLidas: marcarTodasLidas.mutate
  };
}