import React, { useState } from 'react';
import { FixedSizeList } from 'react-window';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ThreadCard from './ThreadCard';
import { useThreadActions } from './hooks/useThreadActions';

export default function VirtualizedThreadList({ threads, selectedId, onSelect, loading }) {
  const [search, setSearch] = useState('');
  const { marcarLida, escalar, arquivar } = useThreadActions();

  const filteredThreads = threads?.filter(t =>
    !search || 
    t.clienteNome?.toLowerCase().includes(search.toLowerCase()) ||
    t.clienteEmail?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const Row = ({ index, style }) => {
    const thread = filteredThreads[index];
    return (
      <div style={style}>
        <ThreadCard
          thread={thread}
          isActive={selectedId === thread.id}
          onClick={() => onSelect(thread)}
          onMarkRead={(t) => marcarLida.mutate(t)}
          onEscalate={(t) => escalar.mutate(t)}
          onArchive={(t) => arquivar.mutate(t)}
        />
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar conversas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>
      <FixedSizeList height={window.innerHeight - 200} itemCount={filteredThreads.length} itemSize={120} width="100%">
        {Row}
      </FixedSizeList>
    </div>
  );
}