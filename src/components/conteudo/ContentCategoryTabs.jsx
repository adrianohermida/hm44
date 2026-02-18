import React from 'react';
import { Button } from '@/components/ui/button';

export default function ContentCategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map(cat => (
        <Button
          key={cat.value}
          variant={active === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(cat.value)}
          className={`whitespace-nowrap ${
            active === cat.value 
              ? 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)]' 
              : 'hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}