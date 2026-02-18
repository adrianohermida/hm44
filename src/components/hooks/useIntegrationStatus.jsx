import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useIntegrationStatus(integrationTypes = []) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatuses();
  }, []);

  const checkStatuses = async () => {
    const results = {};
    
    for (const type of integrationTypes) {
      try {
        const token = await base44.asServiceRole.connectors.getAccessToken(type);
        results[type] = !!token;
      } catch {
        results[type] = false;
      }
    }
    
    setStatuses(results);
    setLoading(false);
  };

  return { statuses, loading, refresh: checkStatuses };
}