import React from 'react';
import { AlertCircle } from 'lucide-react';

const priorityConfig = {
  baixa: { color: 'text-[var(--text-tertiary)]' },
  media: { color: 'text-[var(--brand-warning)]' },
  alta: { color: 'text-[var(--brand-error)]' },
  urgente: { color: 'text-[var(--brand-error)]' }
};

export default function TicketPriority({ prioridade }) {
  const config = priorityConfig[prioridade] || priorityConfig.media;
  
  if (prioridade === 'baixa') return null;
  
  return <AlertCircle className={`w-4 h-4 ${config.color}`} />;
}