import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function VideoProgress({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-primary)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Seu Progresso</span>
        <span className="text-2xl font-bold text-[var(--brand-primary)]">{current}/{total}</span>
      </div>
      <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-600)] h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
        <CheckCircle2 className="w-4 h-4 text-[var(--brand-success)]" />
        <span>{Math.round(percentage)}% concluído</span>
      </div>
    </div>
  );
}