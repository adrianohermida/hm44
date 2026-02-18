import React from 'react';
import ProcessoSearchBar from './ProcessoSearchBar';
import ProcessoFilters from './ProcessoFilters';
import ProcessoViewToggle from './ProcessoViewToggle';

export default function ProcessoToolbar({ busca, onBuscaChange, filtros, onFiltrosChange, viewMode, onViewModeChange, totalFiltrados, totalGeral }) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-3 md:p-4 border border-[var(--border-primary)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1 min-w-0">
          <ProcessoSearchBar value={busca} onChange={onBuscaChange} />
        </div>
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <ProcessoFilters 
            filtros={filtros} 
            onChange={onFiltrosChange}
            totalFiltrados={totalFiltrados}
            totalGeral={totalGeral}
          />
          <ProcessoViewToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}