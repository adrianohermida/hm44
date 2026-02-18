import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useEffect } from 'react';
import useProcessoClientes from './useProcessoClientes';

export default function useProcessoData(processoId) {
  const queryClient = useQueryClient();

  const { data: processo, isLoading } = useQuery({
    queryKey: ['processo', processoId],
    queryFn: () => base44.entities.Processo.filter({ id: processoId }).then(r => r[0]),
    enabled: !!processoId
  });

  const { data: partes = [] } = useQuery({
    queryKey: ['partes', processoId],
    queryFn: () => base44.entities.ProcessoParte.filter({ processo_id: processoId }),
    enabled: !!processoId,
    staleTime: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const { data: clientes = [] } = useProcessoClientes(processoId, partes);

  const { data: resumoIA } = useQuery({
    queryKey: ['resumo-ia', processoId],
    queryFn: async () => {
      const results = await base44.entities.ResumoIAProcesso.filter({ processo_id: processoId });
      return results[0] || null;
    },
    enabled: !!processoId
  });

  useEffect(() => {
    if (!processoId) return;
    
    queryClient.prefetchQuery({
      queryKey: ['honorarios-processo', processoId],
      queryFn: () => base44.entities.Honorario.filter({ processo_id: processoId })
    });
    
    queryClient.prefetchQuery({
      queryKey: ['prazos-processo', processoId],
      queryFn: () => base44.entities.TarefaProcesso.filter({ processo_id: processoId, tipo: 'prazo_processual' })
    });
    
    queryClient.prefetchQuery({
      queryKey: ['audiencias-processo', processoId],
      queryFn: () => base44.entities.AudienciaProcesso.filter({ processo_id: processoId })
    });
    
    queryClient.prefetchQuery({
      queryKey: ['tarefas-processo', processoId],
      queryFn: () => base44.entities.TarefaProcesso.filter({ processo_id: processoId })
    });
    
    queryClient.prefetchQuery({
      queryKey: ['documentos-processo', processoId],
      queryFn: () => base44.entities.DocumentoAnexado.filter({ processo_id: processoId })
    });
  }, [processoId, queryClient]);

  return { processo, clientes, partes, resumoIA, isLoading };
}