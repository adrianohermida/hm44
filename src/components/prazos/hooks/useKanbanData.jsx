import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useKanbanData() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: prazos, isLoading } = useQuery({
    queryKey: ['prazos-kanban'],
    queryFn: () =>
      base44.entities.Prazo.filter({
        escritorio_id: escritorio.id,
        status: 'pendente'
      }),
    enabled: !!escritorio
  });

  const getPrazosByStatus = (status) =>
    prazos?.filter((p) => p.status_kanban === status).sort((a, b) => a.ordem_kanban - b.ordem_kanban) || [];

  return { prazos, isLoading, getPrazosByStatus };
}