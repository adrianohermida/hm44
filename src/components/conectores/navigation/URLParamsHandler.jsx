import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useURLParams(paramName, onValueChange) {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const value = searchParams.get(paramName);
    if (value) {
      onValueChange(value);
    }
  }, [searchParams, paramName, onValueChange]);
}