// Cache configuration for Helpdesk queries
export const helpdeskCacheConfig = {
  tickets: {
    staleTime: 30 * 1000, // 30s
    cacheTime: 5 * 60 * 1000, // 5min
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000 // 30s auto-refresh
  },
  
  ticketMensagens: {
    staleTime: 10 * 1000, // 10s
    cacheTime: 10 * 60 * 1000, // 10min
    refetchOnWindowFocus: true,
    refetchInterval: false // Manual only
  },
  
  templates: {
    staleTime: 60 * 60 * 1000, // 1h
    cacheTime: 24 * 60 * 60 * 1000, // 24h
    refetchOnWindowFocus: false,
    refetchInterval: false
  },
  
  departamentos: {
    staleTime: 60 * 60 * 1000, // 1h
    cacheTime: 24 * 60 * 60 * 1000, // 24h
    refetchOnWindowFocus: false,
    refetchInterval: false
  },
  
  cliente: {
    staleTime: 2 * 60 * 1000, // 2min
    cacheTime: 15 * 60 * 1000, // 15min
    refetchOnWindowFocus: true,
    refetchInterval: false
  }
};

export const getQueryConfig = (queryType) => {
  return helpdeskCacheConfig[queryType] || {
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000
  };
};