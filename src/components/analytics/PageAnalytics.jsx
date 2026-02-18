import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    let observer = null;
    let clsObserver = null;

    try {
      observer = new PerformanceObserver((list) => {
        try {
          const entries = list.getEntries();
          if (!entries) return;
          
          for (const entry of entries) {
            if (entry?.entryType === 'largest-contentful-paint') {
              console.log('[LCP]', entry.startTime);
            }
            if (entry?.entryType === 'first-input') {
              console.log('[FID]', entry.processingStart - entry.startTime);
            }
          }
        } catch (err) {
          // Silently handle observer errors
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

      let clsValue = 0;
      clsObserver = new PerformanceObserver((list) => {
        try {
          const entries = list.getEntries();
          if (!entries) return;
          
          for (const entry of entries) {
            if (entry && !entry.hadRecentInput && typeof entry.value === 'number') {
              clsValue += entry.value;
            }
          }
          console.log('[CLS]', clsValue);
        } catch (err) {
          // Silently handle observer errors
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (err) {
      // Failed to initialize observers
    }

    return () => {
      try {
        observer?.disconnect();
        clsObserver?.disconnect();
      } catch (err) {
        // Cleanup errors ignored
      }
    };
  }, [location.pathname]);

  return null;
}