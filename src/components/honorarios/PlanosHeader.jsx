import React from 'react';
import { DollarSign } from 'lucide-react';

export default function PlanosHeader({ isAdmin, count, children }) {
  return (
    <header className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {isAdmin ? 'Planos de Pagamento' : 'Meu Plano de Pagamento'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {count} {count === 1 ? 'plano' : 'planos'}
            </p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}