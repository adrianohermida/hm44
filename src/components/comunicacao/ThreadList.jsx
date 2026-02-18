import React, { useState, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import ThreadCard from './ThreadCard';
import ThreadListEmpty from './ThreadListEmpty';
import BulkActionsBar from './BulkActionsBar';
import ThreadFilters from './ThreadFilters';
import { useThreadActions } from './hooks/useThreadActions';

const ThreadList = memo(function ThreadList({ threads, selectedId, onSelect, loading, selectedThreadIds = [], onToggleSelect, onSelectAll, onClearSelection }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: null, prioridade: null, canal: null });
  const { marcarLida, escalar, arquivar, bulkMarcarLida, bulkEscalar, bulkArquivar } = useThreadActions();

  const filteredThreads = threads?.filter(t => {
    if (search && !t.clienteNome?.toLowerCase().includes(search.toLowerCase()) && 
        !t.clienteEmail?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filters.status && t.status !== filters.status) return false;
    if (filters.prioridade && t.prioridade !== filters.prioridade) return false;
    if (filters.canal && t.canal !== filters.canal) return false;
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]" />
      </div>
    );
  }

  const allSelected = filteredThreads.length > 0 && filteredThreads.every(t => selectedThreadIds.includes(t.id));

  const handleBulkMarkRead = () => {
    const selectedThreads = filteredThreads.filter(t => selectedThreadIds.includes(t.id));
    bulkMarcarLida.mutate(selectedThreads);
  };

  const handleBulkEscalate = () => {
    const selectedThreads = filteredThreads.filter(t => selectedThreadIds.includes(t.id));
    bulkEscalar.mutate(selectedThreads);
  };

  const handleBulkArchive = () => {
    const selectedThreads = filteredThreads.filter(t => selectedThreadIds.includes(t.id));
    bulkArquivar.mutate(selectedThreads);
  };

  return (
    <div className="flex flex-col h-full">
      <BulkActionsBar
        selectedCount={selectedThreadIds.length}
        onMarkRead={handleBulkMarkRead}
        onArchive={handleBulkArchive}
        onEscalate={handleBulkEscalate}
        onClear={onClearSelection}
        loading={bulkMarcarLida.isPending || bulkArquivar.isPending || bulkEscalar.isPending}
      />

      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        
        {filteredThreads.length > 0 && (
          <div className="flex items-center gap-2 px-1">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => onSelectAll(filteredThreads)}
              id="select-all"
              className="h-4 w-4"
            />
            <label htmlFor="select-all" className="text-xs text-gray-700 cursor-pointer">
              Todos ({filteredThreads.length})
            </label>
          </div>
        )}
      </div>

      <ThreadFilters 
        filters={filters} 
        onFilterChange={setFilters}
        onClearFilters={() => setFilters({ status: null, prioridade: null, canal: null })}
      />

      <div className="flex-1 overflow-y-auto touch-pan-y">
        {!threads || threads.length === 0 ? (
          <ThreadListEmpty />
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <p className="text-center">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          filteredThreads.map(thread => (
            <ThreadCard
              key={`${thread.tipo}-${thread.id}`}
              thread={thread}
              isActive={selectedId === thread.id}
              isSelected={selectedThreadIds.includes(thread.id)}
              onClick={() => onSelect(thread)}
              onToggleSelect={() => onToggleSelect(thread.id)}
              onMarkRead={(t) => marcarLida.mutate(t)}
              onEscalate={(t) => escalar.mutate(t)}
              onArchive={(t) => arquivar.mutate(t)}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default ThreadList;