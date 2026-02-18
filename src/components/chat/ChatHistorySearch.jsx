import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ChatHistorySearch({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="p-4 border-b border-[var(--border-primary)]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <Input
          type="text"
          placeholder="Buscar conversas..."
          value={query}
          onChange={handleChange}
          className="pl-9 h-9 text-sm"
        />
      </div>
    </div>
  );
}