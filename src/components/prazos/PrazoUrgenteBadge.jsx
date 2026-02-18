import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PrazoUrgenteBadge({ dataLimite }) {
  const agora = new Date();
  const limite = new Date(dataLimite);
  const diferencaHoras = (limite - agora) / (1000 * 60 * 60);

  if (diferencaHoras > 72) return null;
  if (diferencaHoras < 0) {
    return (
      <Badge className="bg-[var(--brand-error)] text-[var(--brand-text-on-primary)] font-bold">
        <AlertTriangle className="w-3 h-3 mr-1" aria-hidden="true" />
        VENCIDO
      </Badge>
    );
  }

  const urgente = diferencaHoras <= 24;

  return (
    <Badge 
      className={`${urgente ? 'bg-[var(--brand-error)] animate-pulse' : 'bg-[var(--brand-warning)]'} text-[var(--brand-text-on-primary)] font-bold shadow-lg`}
      role="status"
      aria-live="polite"
    >
      <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
      {Math.floor(diferencaHoras)}h
    </Badge>
  );
}