import { useState, useCallback, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { reportCustomError } from '@/components/debug/ErrorLogger';
import { toast } from 'sonner';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const cache = new Map();
const offlineQueue = [];

export function useInstrumentedFunctions() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const latencyMetrics = useRef({});

  // Detectar offline/online
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      processOfflineQueue();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCacheKey = (functionName, params) => {
    return `${functionName}:${JSON.stringify(params)}`;
  };

  const getFromCache = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  };

  const setCache = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const processOfflineQueue = async () => {
    while (offlineQueue.length > 0 && navigator.onLine) {
      const { functionName, params, resolve, reject } = offlineQueue.shift();
      try {
        const result = await invokeFunction(functionName, params, { skipQueue: true });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
  };

  const invokeFunction = async (functionName, params = {}, options = {}) => {
    const startTime = performance.now();
    const cacheKey = getCacheKey(functionName, params);

    // Verificar cache
    if (!options.skipCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        console.log(`[useInstrumentedFunctions] Cache HIT: ${functionName}`);
        return cached;
      }
    }

    // Se offline, adicionar à queue
    if (isOffline && !options.skipQueue) {
      return new Promise((resolve, reject) => {
        offlineQueue.push({ functionName, params, resolve, reject });
        toast.info(`${functionName} agendado para quando voltar online`);
      });
    }

    let lastError = null;
    
    // Retry logic
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await base44.functions.invoke(functionName, params);
        
        // Tracking de latência
        const latency = performance.now() - startTime;
        latencyMetrics.current[functionName] = latencyMetrics.current[functionName] || [];
        latencyMetrics.current[functionName].push(latency);
        
        // Limitar histórico de métricas
        if (latencyMetrics.current[functionName].length > 50) {
          latencyMetrics.current[functionName].shift();
        }

        // Alertar se latência alta
        if (latency > 5000) {
          reportCustomError(
            `Function ${functionName} demorou ${Math.round(latency)}ms`,
            'PERFORMANCE',
            null,
            { functionName, latency, params }
          );
        }

        // Cachear resposta
        if (!options.skipCache) {
          setCache(cacheKey, result.data);
        }

        console.log(`[useInstrumentedFunctions] Success: ${functionName} (${Math.round(latency)}ms, attempt ${attempt})`);
        
        return result.data;
        
      } catch (error) {
        lastError = error;
        const latency = performance.now() - startTime;

        // Detectar rate limit
        if (error.response?.status === 429) {
          reportCustomError(
            `Rate limit atingido: ${functionName}`,
            'FUNCTIONS',
            error.stack,
            { functionName, params, attempt, latency }
          );
          toast.error('Muitas requisições - aguarde alguns segundos');
          
          // Esperar mais tempo no rate limit
          await sleep(RETRY_DELAY * attempt * 2);
          continue;
        }

        // Detectar quota exceeded
        if (error.response?.data?.error?.includes('quota') || error.response?.data?.error?.includes('limite')) {
          reportCustomError(
            `Quota excedida: ${functionName}`,
            'FUNCTIONS',
            error.stack,
            { functionName, params, error: error.response?.data }
          );
          throw error; // Não retry em quota exceeded
        }

        console.error(`[useInstrumentedFunctions] Attempt ${attempt}/${MAX_RETRIES} failed for ${functionName}:`, error);

        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY * attempt);
        } else {
          // Todas tentativas falharam
          reportCustomError(
            `Function ${functionName} falhou após ${MAX_RETRIES} tentativas`,
            'FUNCTIONS',
            error.stack,
            { 
              functionName, 
              params, 
              totalLatency: latency,
              errorMessage: error.message,
              errorResponse: error.response?.data
            }
          );
        }
      }
    }

    throw lastError;
  };

  const getLatencyStats = (functionName) => {
    const metrics = latencyMetrics.current[functionName];
    if (!metrics || metrics.length === 0) return null;

    const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const sorted = [...metrics].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const max = Math.max(...metrics);

    return {
      avg: Math.round(avg),
      p95: Math.round(p95),
      max: Math.round(max),
      count: metrics.length
    };
  };

  const clearCache = () => {
    cache.clear();
    console.log('[useInstrumentedFunctions] Cache cleared');
  };

  const getOfflineQueueSize = () => offlineQueue.length;

  return {
    invoke: invokeFunction,
    getLatencyStats,
    clearCache,
    isOffline,
    offlineQueueSize: getOfflineQueueSize(),
    latencyMetrics: latencyMetrics.current
  };
}

// Hook simplificado para uso direto
export function useInstrumentedFunction(functionName) {
  const { invoke, getLatencyStats } = useInstrumentedFunctions();

  const execute = useCallback(
    async (params) => {
      return await invoke(functionName, params);
    },
    [invoke, functionName]
  );

  return {
    execute,
    stats: getLatencyStats(functionName)
  };
}