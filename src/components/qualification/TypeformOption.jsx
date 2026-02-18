import React from 'react';
import { Check } from 'lucide-react';

export default function TypeformOption({ label, emoji, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 transition-all text-left hover:border-[var(--brand-primary)] ${
        selected ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' : 'border-[var(--border-primary)] bg-[var(--bg-elevated)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {emoji && <span className="text-2xl">{emoji}</span>}
          <span className="text-lg font-semibold text-[var(--text-primary)]">{label}</span>
        </div>
        {selected && <Check className="w-6 h-6 text-[var(--brand-primary)]" />}
      </div>
    </button>
  );
}