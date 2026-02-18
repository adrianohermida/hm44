import React from 'react';

export default function PlanoInfo({ honorario }) {
  return (
    <div className="mb-6 pb-6 border-b border-[var(--border-primary)]">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4">
        {honorario.tipo}
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-xs text-[var(--text-secondary)]">Modalidade</span>
          <p className="font-semibold text-[var(--text-primary)] mt-1">{honorario.modalidade}</p>
        </div>
        <div>
          <span className="text-xs text-[var(--text-secondary)]">Status</span>
          <p className="font-semibold text-[var(--text-primary)] mt-1">{honorario.status}</p>
        </div>
      </div>
    </div>
  );
}