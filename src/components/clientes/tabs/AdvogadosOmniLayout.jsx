import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function AdvogadoFiltros({ filtros, onFiltrosChange }) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
          Tipo
        </label>
        <Select value={filtros.tipo} onValueChange={(v) => onFiltrosChange({ ...filtros, tipo: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="autor">Do Autor</SelectItem>
            <SelectItem value="reu">Do Réu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">
          Com Cliente Vinculado
        </label>
        <Select value={filtros.vinculado} onValueChange={(v) => onFiltrosChange({ ...filtros, vinculado: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="sim">Sim</SelectItem>
            <SelectItem value="nao">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AdvogadoListItem({ advogado, isSelected, onClick }) {
  return (
    <div 
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' 
          : 'border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]'
      }`}
      onClick={() => onClick(advogado)}
    >
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{advogado.nome}</span>
            {advogado.cliente_vinculado_id && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Vinculado</span>
            )}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            {advogado.oab && <span className="mr-2">OAB: {advogado.oab}</span>}
            {advogado.tipo_representacao && <span>{advogado.tipo_representacao}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvogadoDetailsPanel({ advogado }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="font-semibold">{advogado.nome}</h3>
      </div>
      <div className="space-y-2 text-sm">
        {advogado.oab && (
          <div><span className="text-[var(--text-secondary)]">OAB:</span> {advogado.oab}</div>
        )}
        {advogado.tipo_representacao && (
          <div><span className="text-[var(--text-secondary)]">Representação:</span> {advogado.tipo_representacao}</div>
        )}
        {advogado.cpf && (
          <div><span className="text-[var(--text-secondary)]">CPF:</span> {advogado.cpf}</div>
        )}
        {advogado.cliente_vinculado_id ? (
          <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
            <span className="text-green-800 text-xs font-medium">✓ Cliente Vinculado</span>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
            <span className="text-yellow-800 text-xs">⚠ Sem cliente vinculado</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdvogadosOmniLayout({ advogados, filtros, onFiltrosChange, advogadoSelecionado, onSelectAdvogado }) {
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
              <AdvogadoFiltros filtros={filtros} onFiltrosChange={onFiltrosChange} />
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
          <div className="space-y-2 p-2">
            {advogados.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">Nenhum advogado encontrado</div>
            ) : (
              advogados.map(advogado => (
                <AdvogadoListItem
                  key={advogado.id}
                  advogado={advogado}
                  isSelected={advogadoSelecionado?.id === advogado.id}
                  onClick={onSelectAdvogado}
                />
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
                {advogadoSelecionado && (
                  <Button variant="ghost" size="icon" onClick={() => onSelectAdvogado(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {advogadoSelecionado ? (
                <AdvogadoDetailsPanel advogado={advogadoSelecionado} />
              ) : (
                <div className="flex items-center justify-center h-full p-8 text-center">
                  <p className="text-sm text-gray-500">Selecione um advogado para ver detalhes</p>
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