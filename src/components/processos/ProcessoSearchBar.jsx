import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ProcessoSearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
      <Input
        type="text"
        placeholder="Buscar por número, cliente..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]"
      />
    </div>
  );
}