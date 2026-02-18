import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useErrorReporting } from '@/components/hooks/useErrorReporting';

export function useProcessosData() {
  const { wrapQuery } = useErrorReporting();
  
  const { data: user } = useQuery(wrapQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000 // 5 min
  }, 'PAGE_LOAD', 'usuário'));

  const { data: escritorio } = useQuery(wrapQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0] || null;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000 // 10 min
  }, 'ENTITIES', 'escritório'));

  const { data: processos = [], isLoading: processosLoading } = useQuery(wrapQuery({
    queryKey: ['processos', escritorio?.id, user?.role],
    queryFn: async () => {
      if (!escritorio?.id || !user) {
        console.warn('[useProcessosData] Escritório ou usuário não disponível');
        return [];
      }
      
      console.log('[useProcessosData] Buscando processos - escritório:', escritorio.id, 'role:', user.role);
      
      // Admin: vê todos os processos do escritório
      // Usuário comum: vê apenas processos onde é created_by ou tem permissão explícita
      let result;
      
      if (user.role === 'admin') {
        result = await base44.entities.Processo.filter({ 
          escritorio_id: escritorio.id
        }, '-updated_date', 10000);
      } else {
        // Usuário comum: processos criados por ele OU onde tem permissão
        result = await base44.entities.Processo.filter({ 
          escritorio_id: escritorio.id,
          created_by: user.email
        }, '-updated_date', 10000);
      }
      
      console.log('[useProcessosData] Processos encontrados:', result?.length || 0);
      
      return result || [];
    },
    enabled: !!escritorio?.id && !!user,
    staleTime: 2 * 60 * 1000,
    retry: 2
  }, 'ENTITIES', 'processos'));

  const { data: clientes = [] } = useQuery(wrapQuery({
    queryKey: ['clientes-list', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return base44.entities.Cliente.filter({ 
        escritorio_id: escritorio.id 
      }, undefined, 1000); // Limitar a 1000
    },
    enabled: !!escritorio?.id,
    staleTime: 5 * 60 * 1000 // 5 min
  }, 'ENTITIES', 'clientes'));

  const isLoading = !user || !escritorio || processosLoading;
  
  return { user, escritorio, processos, clientes, isLoading };
}