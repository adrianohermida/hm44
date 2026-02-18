
// Configurações otimizadas para React Query
export const STALE_TIMES = {
  STATIC: 10 * 60 * 1000,    // 10min - Provedores, Endpoints, Escritórios
  DYNAMIC: 30 * 1000,         // 30s - Testes, Histórico, Status
  REALTIME: 5 * 1000          // 5s - Saúde, Monitoramento
};

export const CACHE_TIMES = {
  LONG: 30 * 60 * 1000,      // 30min - Dados raramente alterados
  MEDIUM: 10 * 60 * 1000,    // 10min - Dados ocasionalmente alterados
  SHORT: 2 * 60 * 1000       // 2min - Dados frequentemente alterados
};

export const defaultQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false,
  retry: (failureCount, error) => {
    // Não retry em rate limit
    if (error?.message?.includes('Rate limit') || error?.response?.status === 429) {
      return false;
    }
    return failureCount < 2;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
};

export const realtimeQueryConfig = {
  staleTime: 30 * 1000, // 30 segundos
  refetchInterval: 60 * 1000, // Refetch a cada 1 minuto
  refetchOnWindowFocus: false,
  retry: false
};

export const staticQueryConfig = {
  staleTime: Infinity,
  cacheTime: Infinity,
  refetchOnWindowFocus: false,
  retry: false
};
