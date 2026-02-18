import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function RelatoriosHeader() {
  return (
    <header className="mt-4">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Relatórios
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Análises e métricas do escritório
          </p>
        </div>
      </div>
    </header>
  );
}