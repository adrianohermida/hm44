import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useEffect } from 'react';

const KPI_CACHE_TIME = 5 * 60 * 1000; // 5 min
const KPI_REFETCH = 10 * 60 * 1000; // 10 min

export function useDynamicKPI(escritorioId) {
  const queryClient = useQueryClient();

  // Real-time subscriptions para invalidate cache
  useEffect(() => {
    if (!escritorioId) return;

    const unsubscribers = [
      base44.entities.Processo.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-processos', escritorioId] });
        }
      }),
      base44.entities.Cliente.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-clientes', escritorioId] });
        }
      }),
      base44.entities.Ticket.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-tickets', escritorioId] });
        }
      }),
      base44.entities.Honorario.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-honorarios', escritorioId] });
        }
      }),
      base44.entities.Prazo.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-prazos', escritorioId] });
        }
      }),
      base44.entities.Lead.subscribe((event) => {
        if (event.data?.escritorio_id === escritorioId) {
          queryClient.invalidateQueries({ queryKey: ['kpi-leads', escritorioId] });
        }
      }),
    ];

    return () => {
      unsubscribers.forEach(u => { if (u) u(); });
    };
  }, [escritorioId, queryClient]);

  const kpiProcessos = useQuery({
    queryKey: ['kpi-processos', escritorioId],
    queryFn: () => 
      base44.entities.Processo.filter({ 
        escritorio_id: escritorioId, 
        status: 'ativo' 
      }, undefined, 500),
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  const kpiClientes = useQuery({
    queryKey: ['kpi-clientes', escritorioId],
    queryFn: () => 
      base44.entities.Cliente.filter({ 
        escritorio_id: escritorioId, 
        status: 'ativo' 
      }, undefined, 500),
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  const kpiTickets = useQuery({
    queryKey: ['kpi-tickets', escritorioId],
    queryFn: () => 
      base44.entities.Ticket.filter({
        escritorio_id: escritorioId,
        status: { $in: ['aberto', 'em_atendimento'] }
      }, undefined, 500),
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  const kpiHonorarios = useQuery({
    queryKey: ['kpi-honorarios', escritorioId],
    queryFn: () => 
      base44.entities.Honorario.filter({ 
        escritorio_id: escritorioId 
      }, undefined, 500),
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  const kpiPrazos = useQuery({
    queryKey: ['kpi-prazos', escritorioId],
    queryFn: async () => {
      const all = await base44.entities.Prazo.filter({
        escritorio_id: escritorioId,
        status: { $in: ['pendente', 'em_andamento'] },
      }, undefined, 500);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return all.filter(p => {
        const d = new Date(p.data_vencimento);
        d.setHours(0, 0, 0, 0);
        return Math.floor((d - hoje) / 86400000) <= 7;
      });
    },
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  const kpiLeads = useQuery({
    queryKey: ['kpi-leads', escritorioId],
    queryFn: () => 
      base44.entities.Lead.filter({ 
        escritorio_id: escritorioId 
      }, undefined, 500),
    enabled: !!escritorioId,
    staleTime: KPI_CACHE_TIME,
    refetchInterval: KPI_REFETCH,
  });

  return {
    processos: kpiProcessos.data || [],
    clientes: kpiClientes.data || [],
    tickets: kpiTickets.data || [],
    honorarios: kpiHonorarios.data || [],
    prazos: kpiPrazos.data || [],
    leads: kpiLeads.data || [],
    isLoading: [
      kpiProcessos.isLoading,
      kpiClientes.isLoading,
      kpiTickets.isLoading,
      kpiHonorarios.isLoading,
      kpiPrazos.isLoading,
      kpiLeads.isLoading,
    ].some(l => l),
  };
}