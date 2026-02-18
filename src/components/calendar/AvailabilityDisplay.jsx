import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AvailabilityDisplay({ slots, loading, onSelect }) {
  if (loading) {
    return <div className="text-[var(--text-secondary)]">Carregando...</div>;
  }

  if (slots.length === 0 && !loading) {
    return (
      <div className="text-center p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
        <p className="text-[var(--text-secondary)]">Nenhum horário disponível nesta data. Tente outra data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {slots.map((slot, i) => (
        <button
          key={i}
          onClick={() => onSelect?.(slot)}
          className="flex items-center justify-between p-3 rounded-lg border transition-colors bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:shadow-sm cursor-pointer w-full"
          aria-label={`Selecionar horário ${slot.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} às ${slot.end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {slot.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})} - {slot.end.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
            </span>
          </div>
          <CheckCircle className="w-5 h-5 text-[var(--brand-success)]" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}