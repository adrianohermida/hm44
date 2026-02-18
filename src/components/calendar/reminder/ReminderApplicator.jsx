import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReminderApplicator({ onApply, applying, count }) {
  return (
    <Button
      onClick={onApply}
      disabled={applying}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Bell className="w-4 h-4" aria-hidden="true" />
      {applying ? 'Aplicando...' : `Aplicar a ${count} eventos`}
    </Button>
  );
}