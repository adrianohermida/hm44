import { useCallback } from 'react';
import { reportCustomError } from '@/components/debug/ErrorLogger';

export function useInstrumentedFormValidation(formName) {
  const reportValidationError = useCallback((field, value, error) => {
    reportCustomError(
      `Erro de validação: ${formName} - ${field}`,
      'UX',
      null,
      { formName, field, value: typeof value === 'string' ? value.substring(0, 50) : value, error }
    );
  }, [formName]);

  const wrapValidation = useCallback((validator, field) => {
    return async (value) => {
      try {
        return await validator(value);
      } catch (error) {
        reportValidationError(field, value, error.message);
        throw error;
      }
    };
  }, [reportValidationError]);

  return { reportValidationError, wrapValidation };
}