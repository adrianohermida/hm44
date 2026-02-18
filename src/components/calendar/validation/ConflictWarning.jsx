import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ConflictWarning({ conflicts }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <Alert className="border-[var(--brand-warning)] bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-[var(--brand-warning)]" aria-hidden="true" />
      <AlertDescription className="text-yellow-800">
        <strong>Atenção:</strong> Já existe {conflicts.length} evento(s) neste horário
      </AlertDescription>
    </Alert>
  );
}