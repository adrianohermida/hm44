import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useOptimizedQuery(key, queryFn, options = {}) {
  const {
    cacheTime = 5 * 60 * 1000, // 5min
    staleTime = 2 * 60 * 1000, // 2min
    ...restOptions
  } = options;

  return useQuery({
    queryKey: key,
    queryFn,
    cacheTime,
    staleTime,
    refetchOnWindowFocus: false,
    ...restOptions
  });
}

export function useMemoizedFilter(data = [], filterFn) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter(filterFn);
  }, [data, filterFn]);
}