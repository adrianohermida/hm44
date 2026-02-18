import React from 'react';
import TribunalSelector from './TribunalSelector';

export default function TribunaisGrid({ tribunais, onSelect, selectedSigla }) {
  const categorias = tribunais.reduce((acc, t) => {
    const cat = t.categoria || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(categorias).map(([categoria, lista]) => (
        <div key={categoria}>
          <h3 className="text-sm font-semibold mb-2 text-[var(--brand-text-secondary)]">{categoria}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lista.map(tribunal => (
              <TribunalSelector
                key={tribunal.sigla}
                tribunal={tribunal}
                onSelect={onSelect}
                selected={selectedSigla === tribunal.sigla}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}