import React from 'react';
import { CheckSquare, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskEventCreator({ task, onCreateEvent, creating }) {
  return (
    <Button
      onClick={() => onCreateEvent(task)}
      disabled={creating}
      size="sm"
      variant="outline"
      className="text-[var(--brand-primary)] border-[var(--brand-primary)]"
      aria-label="Criar evento no calendário para esta tarefa"
    >
      <CheckSquare className="w-4 h-4 mr-1" aria-hidden="true" />
      <Calendar className="w-4 h-4" aria-hidden="true" />
    </Button>
  );
}