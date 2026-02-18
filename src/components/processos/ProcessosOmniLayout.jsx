import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessoFilters from './ProcessoFilters';
import ProcessoListItem from './ProcessoListItem';

export default function ProcessosOmniLayout({ 
  processos, 
  filtros, 
  onFiltrosChange,
  processoSelecionado,
  onSelectProcesso,
  detailsComponent: DetailsComponent,
  emptyState: EmptyState,
  clientes
}) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {!filtersCollapsed && (
        <>
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
            <div className="h-full flex flex-col border-r border-[var(--border-primary)] bg-[var(--bg-elevated)]">
              <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                <h3 className="font-semibold text-sm">Filtros</h3>
                <Button variant="ghost" size="icon" onClick={() => setFiltersCollapsed(true)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
              <ProcessoFilters filtros={filtros} onFiltrosChange={onFiltrosChange} clientes={clientes} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}

      {filtersCollapsed && (
        <div className="w-12 border-r border-[var(--border-primary)] bg-[var(--bg-elevated)] flex items-start justify-center pt-4">
          <Button variant="ghost" size="icon" onClick={() => setFiltersCollapsed(false)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <ResizablePanel defaultSize={filtersCollapsed ? 50 : 40} minSize={30}>
        <ScrollArea className="h-full">
          <div className="divide-y divide-[var(--border-primary)]">
            {processos.length === 0 ? (
              EmptyState ? <EmptyState /> : <div className="p-8 text-center text-sm text-gray-500">Nenhum processo encontrado</div>
            ) : (
              processos.map(processo => (
                <div key={processo.id} className="p-2">
                  <ProcessoListItem
                    processo={processo}
                    isSelected={processoSelecionado?.id === processo.id}
                    onClick={() => onSelectProcesso(processo)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {!detailsCollapsed && (
        <ResizablePanel defaultSize={filtersCollapsed ? 50 : 42} minSize={30}>
          <div className="h-full bg-[var(--bg-elevated)] flex flex-col">
            <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
              <h3 className="font-semibold text-sm">Detalhes</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setDetailsCollapsed(true)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                {processoSelecionado && (
                  <Button variant="ghost" size="icon" onClick={() => onSelectProcesso(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {DetailsComponent && processoSelecionado ? (
                <DetailsComponent processo={processoSelecionado} />
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-center">
                  <p className="text-sm text-gray-500">Selecione um processo para ver detalhes</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      )}

      {detailsCollapsed && (
        <div className="w-12 border-l border-[var(--border-primary)] bg-[var(--bg-elevated)] flex items-start justify-center pt-4">
          <Button variant="ghost" size="icon" onClick={() => setDetailsCollapsed(false)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </ResizablePanelGroup>
  );
}