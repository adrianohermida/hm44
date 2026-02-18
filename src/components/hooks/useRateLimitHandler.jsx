import { useEffect } from 'react';
import { toast } from 'sonner';

export default function useRateLimitHandler() {
  useEffect(() => {
    const handleRateLimit = (error) => {
      if (error?.message?.includes('Rate limit exceeded') || 
          error?.response?.status === 429) {
        toast.error('Limite de requisições excedido', {
          description: 'Aguarde alguns segundos antes de tentar novamente',
          duration: 5000
        });
      }
    };

    window.addEventListener('error', handleRateLimit);
    return () => window.removeEventListener('error', handleRateLimit);
  }, []);
}