import React from 'react';
import GrupoEconomicoCard from './GrupoEconomicoCard';

export default function GruposList({ grupos, empresas, onSelect }) {
  if (!grupos || grupos.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhum grupo econômico cadastrado
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {grupos.map((grupo) => (
        <GrupoEconomicoCard
          key={grupo.id}
          grupo={grupo}
          empresas={empresas}
          onClick={() => onSelect(grupo.id)}
        />
      ))}
    </div>
  );
}