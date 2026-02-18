import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Network } from 'lucide-react';

export default function ProcessoTreeToggle({ view, onChange }) {
  return (
    <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('list')}
        className={view === 'list' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant={view === 'tree' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('tree')}
        className={view === 'tree' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Network className="w-4 h-4" />
      </Button>
    </div>
  );
}