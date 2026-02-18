import React from 'react';
import AndamentoItem from './AndamentoItem';

export default function AndamentosList({ andamentos, onSelect }) {
  if (!andamentos || andamentos.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhum andamento registrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {andamentos.map((andamento) => (
        <AndamentoItem
          key={andamento.id}
          andamento={andamento}
          onClick={() => onSelect?.(andamento)}
        />
      ))}
    </div>
  );
}