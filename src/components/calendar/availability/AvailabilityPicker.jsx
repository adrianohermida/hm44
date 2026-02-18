import React, { useState, useEffect } from 'react';
import { useAvailability } from '@/components/hooks/useAvailability';
import AvailabilityDatePicker from '../AvailabilityDatePicker';
import AvailabilityDisplay from '../AvailabilityDisplay';

export default function AvailabilityPicker({ businessStart, businessEnd, onSelectSlot }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { slots, loading, checkAvailability } = useAvailability();

  const handleCheck = () => {
    checkAvailability(date, businessStart, businessEnd);
  };

  const handleSelect = (slot) => {
    onSelectSlot?.(slot, date);
  };

  return (
    <div className="space-y-4">
      <AvailabilityDatePicker 
        date={date} 
        onChange={setDate} 
        onCheck={handleCheck} 
        loading={loading} 
      />
      <AvailabilityDisplay 
        slots={slots} 
        loading={loading} 
        onSelect={handleSelect} 
      />
    </div>
  );
}