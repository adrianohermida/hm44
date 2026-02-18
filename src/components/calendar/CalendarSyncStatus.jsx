import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function CalendarSyncStatus({ connected, lastSync }) {
  if (!connected) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-[var(--text-secondary)]">
          Google Calendar não conectado. Configure em Configurações.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-[var(--brand-primary-50)] border-[var(--brand-primary-200)]">
      <CheckCircle className="h-4 w-4 text-[var(--brand-primary)]" />
      <AlertDescription className="text-[var(--text-secondary)]">
        Sincronizado com Google Calendar
        {lastSync && ` - ${lastSync}`}
      </AlertDescription>
    </Alert>
  );
}