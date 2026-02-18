import React from 'react';
import { Bell, BellOff } from 'lucide-react';

export default function ReminderBadge({ hasReminder }) {
  if (!hasReminder) {
    return (
      <BellOff 
        className="w-3 h-3 text-[var(--text-tertiary)]" 
        aria-label="Sem lembrete"
      />
    );
  }

  return (
    <Bell 
      className="w-3 h-3 text-[var(--brand-warning)]" 
      aria-label="Lembrete ativo"
    />
  );
}