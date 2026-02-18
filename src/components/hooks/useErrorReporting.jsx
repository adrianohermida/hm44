import { useCallback } from 'react';
import { reportCustomError } from '@/components/debug/ErrorLogger';

export function useErrorReporting() {
  const reportError = useCallback((message, category, error = null, context = null) => {
    const stack = error?.stack || (error ? String(error) : null);
    reportCustomError(message, category, stack, context);
  }, []);

  const wrapQuery = useCallback((queryConfig, category, entityName) => {
    return {
      ...queryConfig,
      onError: (error) => {
        reportError(
          `Erro ao carregar ${entityName}`,
          category,
          error,
          { 
            queryKey: queryConfig.queryKey,
            error: error.message 
          }
        );
        queryConfig.onError?.(error);
      }
    };
  }, [reportError]);

  const wrapMutation = useCallback((mutationConfig, category, action) => {
    return {
      ...mutationConfig,
      onError: (error, variables) => {
        reportError(
          `Erro ao ${action}`,
          category,
          error,
          { 
            variables,
            error: error.message 
          }
        );
        mutationConfig.onError?.(error, variables);
      }
    };
  }, [reportError]);

  return { reportError, wrapQuery, wrapMutation };
}