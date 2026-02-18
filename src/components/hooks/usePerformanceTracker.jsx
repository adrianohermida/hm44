import { useEffect, useRef } from 'react';
import { reportCustomError } from '@/components/debug/ErrorLogger';

const THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 600,
  BUNDLE_SIZE: 500 * 1024, // 500KB
  MEMORY_LEAK: 50 * 1024 * 1024 // 50MB
};

export function usePerformanceTracker(pageName) {
  const memoryBaseline = useRef(null);
  const bundleSizes = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // LCP
        if (entry.entryType === 'largest-contentful-paint') {
          const value = entry.renderTime || entry.loadTime;
          if (value > THRESHOLDS.LCP) {
            reportCustomError(
              `LCP alto em ${pageName}: ${Math.round(value)}ms`,
              'PERFORMANCE',
              null,
              { metric: 'LCP', value: Math.round(value), threshold: THRESHOLDS.LCP, page: pageName }
            );
          }
        }

        // FID
        if (entry.entryType === 'first-input') {
          const value = entry.processingStart - entry.startTime;
          if (value > THRESHOLDS.FID) {
            reportCustomError(
              `FID alto em ${pageName}: ${Math.round(value)}ms`,
              'PERFORMANCE',
              null,
              { metric: 'FID', value: Math.round(value), threshold: THRESHOLDS.FID, page: pageName }
            );
          }
        }

        // CLS
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          if (entry.value > THRESHOLDS.CLS) {
            // Capturar quais elementos causaram o shift
            const sources = entry.sources || [];
            const shiftSources = sources.map(s => {
              const node = s.node;
              return {
                element: node?.tagName || 'unknown',
                className: node?.className?.split(' ')[0] || 'none',
                id: node?.id || 'none',
                previousRect: s.previousRect ? `${s.previousRect.width}x${s.previousRect.height}` : null,
                currentRect: s.currentRect ? `${s.currentRect.width}x${s.currentRect.height}` : null
              };
            });

            reportCustomError(
              `CLS alto em ${pageName}: ${entry.value.toFixed(3)}`,
              'PERFORMANCE',
              null,
              { 
                metric: 'CLS', 
                value: entry.value.toFixed(3), 
                threshold: THRESHOLDS.CLS, 
                page: pageName,
                sourcesCount: sources.length,
                shiftSources: shiftSources.slice(0, 3), // Top 3 elementos
                timestamp: entry.startTime
              }
            );
          }
        }

        // FCP - First Contentful Paint
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          if (entry.startTime > THRESHOLDS.FCP) {
            reportCustomError(
              `FCP alto em ${pageName}: ${Math.round(entry.startTime)}ms`,
              'PERFORMANCE',
              null,
              { metric: 'FCP', value: Math.round(entry.startTime), threshold: THRESHOLDS.FCP, page: pageName }
            );
          }
        }

        // TTFB - Time to First Byte
        if (entry.entryType === 'navigation') {
          const ttfb = entry.responseStart - entry.requestStart;
          if (ttfb > THRESHOLDS.TTFB) {
            reportCustomError(
              `TTFB alto em ${pageName}: ${Math.round(ttfb)}ms`,
              'PERFORMANCE',
              null,
              { metric: 'TTFB', value: Math.round(ttfb), threshold: THRESHOLDS.TTFB, page: pageName }
            );
          }

          // Bundle Size
          if (entry.transferSize > THRESHOLDS.BUNDLE_SIZE) {
            reportCustomError(
              `Bundle grande em ${pageName}: ${Math.round(entry.transferSize / 1024)}KB`,
              'PERFORMANCE',
              null,
              { metric: 'BUNDLE_SIZE', value: entry.transferSize, threshold: THRESHOLDS.BUNDLE_SIZE, page: pageName }
            );
          }
        }

        // Resource chunks grandes
        if (entry.entryType === 'resource' && entry.name.includes('.js')) {
          const size = entry.transferSize;
          if (size > 200 * 1024) { // 200KB
            const filename = entry.name.split('/').pop();
            reportCustomError(
              `Chunk JS grande: ${filename} (${Math.round(size / 1024)}KB)`,
              'PERFORMANCE',
              null,
              { metric: 'CHUNK_SIZE', value: size, file: filename, page: pageName }
            );
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation', 'resource'] });
    } catch (error) {
      console.warn('Performance tracking não suportado:', error);
    }

    // Memory Leak Detection
    const checkMemory = () => {
      if (performance.memory) {
        const usedMemory = performance.memory.usedJSHeapSize;
        
        if (!memoryBaseline.current) {
          memoryBaseline.current = usedMemory;
        } else {
          const growth = usedMemory - memoryBaseline.current;
          
          if (growth > THRESHOLDS.MEMORY_LEAK) {
            reportCustomError(
              `Possível memory leak em ${pageName}: +${Math.round(growth / 1024 / 1024)}MB`,
              'PERFORMANCE',
              null,
              { 
                metric: 'MEMORY_LEAK',
                baseline: memoryBaseline.current,
                current: usedMemory,
                growth,
                page: pageName
              }
            );
            memoryBaseline.current = usedMemory; // Reset
          }
        }
      }
    };

    const memoryInterval = setInterval(checkMemory, 30000); // Check cada 30s

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, [pageName]);
}