import React from 'react';
import CalendarEventCard from './CalendarEventCard';
import { Calendar } from 'lucide-react';

export default function CalendarEventsList({ events, loading }) {
  if (loading) {
    return <div className="text-center py-8 text-[var(--text-secondary)]">Carregando eventos...</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Calendar className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
        <p className="text-[var(--text-secondary)]">Nenhum evento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <CalendarEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}