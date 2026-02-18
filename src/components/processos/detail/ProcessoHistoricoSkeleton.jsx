import React from 'react';

export default function ProcessoHistoricoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/3" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}