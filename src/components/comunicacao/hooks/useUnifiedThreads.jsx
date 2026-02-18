import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { transformToThreads } from './useThreadTransform';
import { reportCustomError } from '@/components/debug/ErrorLogger';

export function useUnifiedThreads(filters = {}) {
  const { canal, tipo, status, search } = filters;

  return useQuery({
    queryKey: ['unified-threads', canal, tipo, status, search],
    staleTime: 5000,
    gcTime: 60000,
    onError: (error) => {
      reportCustomError('Erro ao carregar threads unificadas', 'ENTITIES', error.stack, { filters });
    },
    queryFn: async () => {
      const user = await base44.auth.me();
      
      if (!user.escritorio_id) {
        throw new Error('Usuário sem escritório associado. Configure seu perfil.');
      }

      const [conversas, tickets] = await Promise.all([
        base44.entities.Conversa.filter({ escritorio_id: user.escritorio_id }),
        base44.entities.Ticket.filter({ escritorio_id: user.escritorio_id })
      ]);

      let threads = transformToThreads(conversas, tickets);

      if (canal && canal !== 'todos') threads = threads.filter(t => t.canal === canal);
      if (tipo && tipo !== 'todos') threads = threads.filter(t => tipo === 'visitante' ? t.isVisitante : !t.isVisitante);
      if (status) threads = threads.filter(t => t.status === status);
      if (search) {
        const s = search.toLowerCase();
        threads = threads.filter(t =>
          t.clienteNome?.toLowerCase().includes(s) ||
          t.clienteEmail?.toLowerCase().includes(s) ||
          t.ultimaMensagem?.toLowerCase().includes(s)
        );
      }

      return threads;
    },
    refetchInterval: 10000,
  });
}