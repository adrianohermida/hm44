import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AvailabilityStatus({ status }) {
  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        <span>Verificando disponibilidade...</span>
      </div>
    );
  }

  if (status === 'conflict') {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--brand-error)]">
        <XCircle className="w-4 h-4" aria-hidden="true" />
        <span>Horário indisponível - conflito detectado</span>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--brand-success)]">
        <CheckCircle className="w-4 h-4" aria-hidden="true" />
        <span>Horário disponível</span>
      </div>
    );
  }

  return null;
}