import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useCalendarEvents(autoLoad = true) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async (timeMin, timeMax) => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('getGoogleCalendarEvents', {
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      setEvents(result.data.events || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (autoLoad) loadEvents();
  }, [autoLoad]);

  return { events, loading, loadEvents };
}