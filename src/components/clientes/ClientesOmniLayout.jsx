import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClienteFilters from './ClienteFilters';
import ClienteListItem from './ClienteListItem';

export default function ClientesOmniLayout({ 
  clientes, 
  filtros, 
  onFiltrosChange,
  clienteSelecionado,
  onSelectCliente,
  detailsComponent: DetailsComponent,
  emptyState: EmptyState
}) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [buscaLocal, setBuscaLocal] = useState('');

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
              <ClienteFilters filtros={filtros} onFiltrosChange={onFiltrosChange} />
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
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-[var(--border-primary)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar clientes..."
                value={buscaLocal}
                onChange={(e) => setBuscaLocal(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-[var(--border-primary)]">
              {clientes.filter(c => 
                !buscaLocal || 
                c.nome_completo?.toLowerCase().includes(buscaLocal.toLowerCase()) ||
                c.email?.toLowerCase().includes(buscaLocal.toLowerCase()) ||
                c.cpf_cnpj?.includes(buscaLocal)
              ).length === 0 ? (
                EmptyState ? <EmptyState /> : <div className="p-8 text-center text-sm text-gray-500">Nenhum contato encontrado</div>
              ) : (
                clientes.filter(c => 
                  !buscaLocal || 
                  c.nome_completo?.toLowerCase().includes(buscaLocal.toLowerCase()) ||
                  c.email?.toLowerCase().includes(buscaLocal.toLowerCase()) ||
                  c.cpf_cnpj?.includes(buscaLocal)
                ).map(cliente => (
                  <div key={cliente.id} className="p-2">
                    <ClienteListItem
                      cliente={cliente}
                      isSelected={clienteSelecionado?.id === cliente.id}
                      onClick={() => onSelectCliente(cliente)}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
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
                {clienteSelecionado && (
                  <Button variant="ghost" size="icon" onClick={() => onSelectCliente(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {DetailsComponent && clienteSelecionado ? (
                <DetailsComponent cliente={clienteSelecionado} />
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-center">
                  <p className="text-sm text-gray-500">Selecione um contato para ver detalhes</p>
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