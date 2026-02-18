import React from 'react';
import { UserCheck } from 'lucide-react';
import LeadFilters from './LeadFilters';

export default function LeadsHeader({ count, filter, onFilterChange }) {
  return (
    <header className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Solicitações
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {count} {count === 1 ? 'lead' : 'leads'}
            </p>
          </div>
        </div>
        <LeadFilters filter={filter} onFilterChange={onFilterChange} />
      </div>
    </header>
  );
}