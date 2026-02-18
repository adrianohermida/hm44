import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReminderBadge from '../reminder/ReminderBadge';

export default function EventCard({ event, onAddNote }) {
  return (
    <div className="p-3 rounded-lg border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-[var(--text-tertiary)] flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">{event.time}</span>
            <ReminderBadge hasReminder={event.hasReminder} />
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{event.title}</p>
          {event.notes && (
            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{event.notes}</p>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddNote(event)}
          className="flex-shrink-0"
          aria-label={`Adicionar nota ao evento ${event.title}`}
        >
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}