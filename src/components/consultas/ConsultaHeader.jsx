import React from 'react';
import { Calendar } from 'lucide-react';
import ConsultaFilters from './ConsultaFilters';

export default function ConsultaHeader({ leads, filter, onFilterChange }) {
  return (
    <header className="mt-4">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" aria-hidden="true" />
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          Gerenciar Consultas
        </h1>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm md:text-base text-[var(--text-secondary)]">
          {leads.length} solicitações de consulta
        </p>
        <ConsultaFilters status={filter} onStatusChange={onFilterChange} />
      </div>
    </header>
  );
}