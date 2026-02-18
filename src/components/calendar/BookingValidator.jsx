import React, { useState, useEffect } from 'react';
import { useGoogleCalendar } from '@/components/hooks/useGoogleCalendar';
import AvailabilityStatus from './validation/AvailabilityStatus';
import ConflictWarning from './validation/ConflictWarning';

export default function BookingValidator({ dateTime, duration, onValidation }) {
  const [status, setStatus] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const { getAvailability } = useGoogleCalendar();

  useEffect(() => {
    if (dateTime && duration) {
      checkAvailability();
    }
  }, [dateTime, duration]);

  const checkAvailability = async () => {
    setStatus('checking');
    const date = new Date(dateTime);
    const result = await getAvailability(date.toISOString());

    if (result.success) {
      const endTime = new Date(date.getTime() + duration * 60000);
      const conflictingEvents = result.events.filter(e => {
        const eventStart = new Date(e.start.dateTime || e.start.date);
        const eventEnd = new Date(e.end.dateTime || e.end.date);
        return (date < eventEnd && endTime > eventStart);
      });

      setConflicts(conflictingEvents);
      const hasConflict = conflictingEvents.length > 0;
      setStatus(hasConflict ? 'conflict' : 'available');
      onValidation?.(!hasConflict);
    }
  };

  if (!dateTime) return null;

  return (
    <div className="space-y-2">
      <AvailabilityStatus status={status} />
      <ConflictWarning conflicts={conflicts} />
    </div>
  );
}