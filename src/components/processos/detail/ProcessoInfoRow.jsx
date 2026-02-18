import React from 'react';

export default function ProcessoInfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-[var(--border-primary)] last:border-0">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm text-[var(--text-primary)] text-right">{value || '-'}</span>
    </div>
  );
}