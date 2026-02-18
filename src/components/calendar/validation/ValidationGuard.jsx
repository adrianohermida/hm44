import React from 'react';
import { Shield } from 'lucide-react';

export default function ValidationGuard({ isValid, children }) {
  return (
    <div className="relative">
      {!isValid && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--brand-warning)]" aria-hidden="true" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Aguardando validação de horário
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}