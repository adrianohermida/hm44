import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from './useGoogleCalendar';

export function useTeamEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAvailability } = useGoogleCalendar();

  useEffect(() => {
    loadTeamEvents();
  }, []);

  const loadTeamEvents = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const prefix = user.team_event_prefix || '[EQUIPE]';
      const calendarIds = user.team_calendar_ids || '';
      
      const today = new Date();
      const result = await getAvailability(today.toISOString());
      
      if (result.success) {
        const filtered = result.events.filter(e => {
          const hasPrefix = e.summary?.includes(prefix);
          const hasMultipleAttendees = e.attendees?.length > 1;
          return hasPrefix || hasMultipleAttendees;
        });
        
        const formatted = filtered.map(e => ({
          title: e.summary,
          when: formatDateTime(e.start.dateTime || e.start.date),
          attendees: e.attendees?.length || 0
        }));
        
        setEvents(formatted);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos de equipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dt) => {
    const date = new Date(dt);
    const day = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${time}`;
  };

  return { events, loading, refresh: loadTeamEvents };
}