import React from 'react';
import SlotCard from './SlotCard';
import { Calendar } from 'lucide-react';

export default function CalendarAvailabilitySlots({ slots, loading, isAdmin, onBook }) {
  if (loading) {
    return <div className="text-center py-4 text-[var(--text-secondary)]">Carregando...</div>;
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col items-center py-8">
        <Calendar className="w-12 h-12 text-[var(--text-tertiary)] mb-2" />
        <p className="text-sm text-[var(--text-secondary)]">Nenhum horário disponível</p>
      </div>
    );
  }

  const visibleSlots = isAdmin ? slots : slots.filter(s => s.status === 'available');

  return (
    <div className="space-y-2">
      {visibleSlots.map((slot, idx) => (
        <SlotCard key={idx} slot={slot} isAdmin={isAdmin} onBook={onBook} />
      ))}
    </div>
  );
}