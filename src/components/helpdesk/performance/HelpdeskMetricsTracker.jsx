import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useHelpdeskMetrics(ticketId, action) {
  useEffect(() => {
    if (!ticketId || !action) return;

    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      
      // Log apenas se > 5s (performance issue)
      if (duration > 5000) {
        try {
          base44.functions.invoke('helpdesk/logPerformanceMetric', {
            ticket_id: ticketId,
            action,
            duration_ms: duration,
            timestamp: new Date().toISOString()
          }).catch(() => {});
        } catch {}
      }
    };
  }, [ticketId, action]);
}

export function trackHelpdeskAction(action, metadata = {}) {
  const timestamp = new Date().toISOString();
  
  try {
    base44.functions.invoke('helpdesk/logAction', {
      action,
      metadata,
      timestamp
    }).catch(() => {});
  } catch {}
}