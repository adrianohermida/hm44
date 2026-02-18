import React from 'react';
import { Button } from '@/components/ui/button';

const FILTERS = [
  { id: 'recentes', label: 'Mais Recentes' },
  { id: 'vistos', label: 'Mais Vistos' },
  { id: 'curtidos', label: 'Mais Curtidos' },
];

export default function ShortsFilters({ active, onChange }) {
  return (
    <div className="flex gap-2 justify-center mb-8 flex-wrap">
      {FILTERS.map((filter) => (
        <Button
          key={filter.id}
          variant={active === filter.id ? 'default' : 'outline'}
          onClick={() => onChange(filter.id)}
          className={
            active === filter.id
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]'
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}