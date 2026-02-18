import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SidebarSearch({ value, onChange }) {
  return (
    <div className="p-3 border-b border-[var(--border-primary)]">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <Input
          placeholder="Pesquisar uma exibição"
          className="pl-8 h-8 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}