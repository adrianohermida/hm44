import React from 'react';
import NovoProcessoMenu from './NovoProcessoMenu';

export default function ProcessosHeader({ totalProcessos, onNovo, onBuscar }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Processos</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {totalProcessos} {totalProcessos === 1 ? 'processo' : 'processos'}
        </p>
      </div>
      <NovoProcessoMenu onNovo={onNovo} onBuscar={onBuscar} />
    </div>
  );
}