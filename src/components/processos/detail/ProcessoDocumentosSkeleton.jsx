import React from 'react';

export default function ProcessoDocumentosSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border border-[var(--border-primary)] rounded-lg space-y-3">
          <div className="h-5 bg-[var(--bg-tertiary)] rounded w-2/3" />
          <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-8 bg-[var(--bg-tertiary)] rounded flex-1" />
            <div className="h-8 bg-[var(--bg-tertiary)] rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}