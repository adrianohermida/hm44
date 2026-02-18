import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useGoogleCalendar } from './useGoogleCalendar';
import { generateBusinessHours } from '../utils/calendarHelpers';

export function useAvailability() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAvailability } = useGoogleCalendar();

  const checkAvailability = async (date, businessStart = '09:00', businessEnd = '18:00') => {
    setLoading(true);
    try {
      const result = await getAvailability(date);
      if (result.success) {
        const businessHours = generateBusinessHours(date, businessStart, businessEnd);
        const available = businessHours.filter(slot => {
          const hasConflict = result.events.some(e => {
            const eventStart = new Date(e.start.dateTime || e.start.date);
            const eventEnd = new Date(e.end.dateTime || e.end.date);
            return (slot.start < eventEnd && slot.end > eventStart);
          });
          return !hasConflict;
        });
        setSlots(available);
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return { slots, loading, checkAvailability };
}