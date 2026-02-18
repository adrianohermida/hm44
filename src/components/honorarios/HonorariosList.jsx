import React from 'react';
import HonorarioCard from './HonorarioCard';

export default function HonorariosList({ honorarios, selected, onSelect, isAdmin }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-primary)]">
        <h2 className="font-semibold text-[var(--text-primary)] text-lg">
          {isAdmin ? 'Todos os Planos' : 'Meus Planos'}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {honorarios.map(h => (
          <HonorarioCard key={h.id} honorario={h} isSelected={selected?.id === h.id} onClick={() => onSelect(h)} />
        ))}
        {honorarios.length === 0 && (
          <p className="text-[var(--text-secondary)] text-center py-8 text-sm">
            Nenhum plano
          </p>
        )}
      </div>
    </div>
  );
}