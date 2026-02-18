import React from 'react';
import { Calendar } from 'lucide-react';
import DayColumn from './schedule/DayColumn';

export default function WeeklySchedule({ events, onSelectEvent }) {
  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-primary)]">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[var(--brand-primary)]" />
        Agenda da Semana
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {events.map((day, i) => (
          <DayColumn key={i} day={day} onAddNote={onSelectEvent} />
        ))}
      </div>
    </div>
  );
}