import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useCalendarioPrazos(selectedDate) {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: prazos, isLoading } = useQuery({
    queryKey: ['prazos-calendario', selectedDate],
    queryFn: () =>
      base44.entities.Prazo.filter({
        escritorio_id: escritorio.id,
        status: 'pendente'
      }),
    enabled: !!escritorio
  });

  const getPrazosNaData = (date) => {
    if (!prazos) return [];
    const dateStr = date.toISOString().split('T')[0];
    return prazos.filter(p => p.data_vencimento?.startsWith(dateStr));
  };

  return { prazos, isLoading, getPrazosNaData };
}