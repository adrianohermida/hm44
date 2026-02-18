import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useImportNotifications() {
  const { data: notificacoes = [] } = useQuery({
    queryKey: ['import-notifications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const notifs = await base44.entities.Notificacao.filter({
        user_email: user.email,
        tipo: { $in: ['IMPORTACAO_PROGRESSO', 'IMPORTACAO_CONCLUIDA'] },
        lida: false
      }, '-created_date', 10);
      return notifs;
    },
    refetchInterval: 5000 // Refetch a cada 5s para pegar novas notificações
  });

  return {
    importNotifications: notificacoes,
    hasActiveImports: notificacoes.some(n => n.tipo === 'IMPORTACAO_PROGRESSO')
  };
}