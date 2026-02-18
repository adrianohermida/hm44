import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}