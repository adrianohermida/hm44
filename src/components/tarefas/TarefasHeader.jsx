import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function TarefasHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <CheckSquare className="w-8 h-8 text-[var(--brand-primary)]" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Tarefas</h1>
      </div>
      <p className="text-[var(--text-secondary)]">
        Gerencie suas tarefas e sincronize com Google Calendar
      </p>
    </header>
  );
}