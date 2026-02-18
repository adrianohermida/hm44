import React from 'react';
import EventCard from './EventCard';

export default function DayColumn({ day, onAddNote }) {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-4">
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 capitalize">{day.date}</h3>
      <div className="space-y-2">
        {day.items.length === 0 ? (
          <p className="text-xs text-[var(--text-tertiary)] italic">Sem eventos</p>
        ) : (
          day.items.map((item, i) => (
            <EventCard key={i} event={item} onAddNote={onAddNote} />
          ))
        )}
      </div>
    </div>
  );
}