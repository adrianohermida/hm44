import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useCronInvalidation() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCronComplete = (event) => {
      const { invalidate_cache } = event.detail || {};
      
      if (invalidate_cache && Array.isArray(invalidate_cache)) {
        invalidate_cache.forEach(key => {
          queryClient.invalidateQueries([key]);
        });
      }
    };

    window.addEventListener('cron-completed', handleCronComplete);
    return () => window.removeEventListener('cron-completed', handleCronComplete);
  }, [queryClient]);
}