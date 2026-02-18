import React from 'react';
import ClienteSearchBar from './ClienteSearchBar';
import ClienteFilters from './ClienteFilters';
import ClienteViewToggle from './ClienteViewToggle';

export default function ClienteToolbar({ busca, onBuscaChange, filtro, onFiltroChange, viewMode, onViewModeChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <ClienteSearchBar value={busca} onChange={onBuscaChange} />
      </div>
      <div className="flex gap-2">
        <ClienteFilters filtro={filtro} onChange={onFiltroChange} />
        <ClienteViewToggle viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}