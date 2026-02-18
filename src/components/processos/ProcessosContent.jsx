import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import BulkActionsBar from './BulkActionsBar';
import SelectAllBar from './SelectAllBar';
import ProcessoEmptyState from './ProcessoEmptyState';

const ProcessosList = lazy(() => import('./ProcessosList'));
const ProcessoListView = lazy(() => import('./ProcessoListView'));

export default function ProcessosContent({
  processos,
  clientes,
  viewMode,
  selectedIds,
  busca,
  filtros,
  onToggleSelection,
  onToggleAll,
  onBulkAction,
  onClearSelection,
  onNovoProcesso
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (processos.length === 0) {
    return (
      <ProcessoEmptyState 
        onNovoProcesso={onNovoProcesso} 
        temBusca={!!busca || filtros.status !== 'todos' || filtros.cliente_id !== 'todos' || (filtros.publicacao && filtros.publicacao !== 'todos')} 
      />
    );
  }

  return (
    <>
      {viewMode === 'lista' && (
        <SelectAllBar 
          total={processos.length}
          selected={selectedIds.length}
          onToggleAll={onToggleAll}
        />
      )}
      
      {selectedIds.length > 0 && (
        <BulkActionsBar 
          count={selectedIds.length}
          onAction={onBulkAction}
          onClear={onClearSelection}
        />
      )}

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      }>
        {viewMode === 'cards' ? (
          <ProcessosList 
            processos={processos} 
            onSelect={(id) => navigate(`${createPageUrl('ProcessoDetails')}?id=${id}`)} 
          />
        ) : (
          <ProcessoListView 
            processos={processos}
            selectedIds={selectedIds}
            onToggle={onToggleSelection}
            onClick={(id) => navigate(`${createPageUrl('ProcessoDetails')}?id=${id}`)}
            clientes={clientes}
          />
        )}
      </Suspense>
    </>
  );
}