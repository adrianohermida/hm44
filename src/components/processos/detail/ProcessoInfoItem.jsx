import React from 'react';

export default function ProcessoInfoItem({ label, value, icon: Icon }) {
  if (!value || value === '-') return null;

  return (
    <div className="flex items-start justify-between py-2 border-b border-[var(--border-primary)] last:border-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />}
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      </div>
      <span className="text-sm font-medium text-[var(--text-primary)] text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}