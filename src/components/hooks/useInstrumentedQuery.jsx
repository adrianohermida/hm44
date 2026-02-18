import { useQuery, useMutation } from '@tanstack/react-query';
import { useErrorReporting } from './useErrorReporting';

export function useInstrumentedQuery(config, category = 'ENTITIES', entityName = 'dados') {
  const { wrapQuery } = useErrorReporting();
  return useQuery(wrapQuery(config, category, entityName));
}

export function useInstrumentedMutation(config, category = 'ENTITIES', action = 'executar ação') {
  const { wrapMutation } = useErrorReporting();
  return useMutation(wrapMutation(config, category, action));
}