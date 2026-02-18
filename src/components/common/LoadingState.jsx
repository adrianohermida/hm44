import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      <p className="text-sm text-[var(--text-secondary)] mt-3">{message}</p>
    </div>
  );
}