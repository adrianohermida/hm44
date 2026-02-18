import React from 'react';
import { Receipt } from 'lucide-react';

export default function FaturasHeader({ isAdmin }) {
  return (
    <div className="flex items-center gap-3">
      <Receipt className="w-8 h-8 text-[var(--brand-primary)]" />
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        {isAdmin ? 'Faturas' : 'Minhas Faturas'}
      </h1>
    </div>
  );
}