import React from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSyncButton({ onSync, syncing, count }) {
  return (
    <Button
      onClick={onSync}
      disabled={syncing}
      className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white"
      aria-label={`Sincronizar ${count} agendamentos com Google Calendar`}
    >
      {syncing ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
      ) : (
        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
      )}
      Sincronizar ({count})
    </Button>
  );
}