import React from 'react';
import PlanoCard from './PlanoCard';

export default function PlanosLista({ planos, selected, onSelect }) {
  if (planos.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-[var(--text-secondary)] text-center">
          Nenhum plano encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {planos.map(plano => (
        <PlanoCard
          key={plano.id}
          plano={plano}
          selected={selected?.id === plano.id}
          onClick={() => onSelect(plano)}
        />
      ))}
    </div>
  );
}