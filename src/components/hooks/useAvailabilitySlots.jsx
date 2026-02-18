import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useAvailabilitySlots(date) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('getAvailabilitySlots', {
        date: date || new Date().toISOString().split('T')[0]
      });
      setSlots(result.data.slots || []);
    } catch (error) {
      console.error('Erro ao carregar slots:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (date) loadSlots();
  }, [date]);

  return { slots, loading, loadSlots };
}