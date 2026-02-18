import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConsultasHeader({ count, onAgendar }) {
  return (
    <header className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Minhas Consultas
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {count} {count === 1 ? 'consulta agendada' : 'consultas agendadas'}
          </p>
        </div>
      </div>
      {onAgendar && (
        <Button onClick={onAgendar} className="bg-[var(--brand-primary)] hidden md:flex">
          <Plus className="w-4 h-4 mr-2" />
          Agendar
        </Button>
      )}
    </header>
  );
}