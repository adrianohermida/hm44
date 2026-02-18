import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AvailabilityDatePicker({ date, onChange, onCheck, loading }) {
  return (
    <div className="flex gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] bg-[var(--bg-primary)]"
        aria-label="Selecionar data para verificar disponibilidade"
      />
      <Button onClick={onCheck} disabled={loading} className="bg-[var(--brand-primary)]">
        <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
        Verificar
      </Button>
    </div>
  );
}