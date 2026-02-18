import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useMonitoramentos() {
  return useQuery({
    queryKey: ['monitoramentos-ativos'],
    queryFn: async () => {
      return await base44.entities.MonitoramentoEscavador.filter({ ativo: true });
    }
  });
}

export function useAparicoes(monitoramentoId) {
  return useQuery({
    queryKey: ['aparicoes', monitoramentoId],
    queryFn: async () => {
      return await base44.entities.AparicaoMonitoramento.filter({ 
        monitoramento_id: monitoramentoId 
      }, '-created_date');
    },
    enabled: !!monitoramentoId
  });
}