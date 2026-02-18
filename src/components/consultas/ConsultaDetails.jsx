import React from 'react';
import { Calendar, MessageSquare } from 'lucide-react';

export default function ConsultaDetails({ data, horario, motivo }) {
  return (
    <div className="space-y-2">
      {data && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
          <Calendar className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" aria-hidden="true" />
          <span className="font-medium">{data} às {horario}</span>
        </div>
      )}
      {motivo && (
        <div className="flex gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span className="text-[var(--text-secondary)] line-clamp-2">{motivo}</span>
        </div>
      )}
    </div>
  );
}