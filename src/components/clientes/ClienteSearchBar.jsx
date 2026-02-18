import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ClienteSearchBar({ value, onChange, placeholder = "Buscar clientes..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-primary)]"
      />
    </div>
  );
}