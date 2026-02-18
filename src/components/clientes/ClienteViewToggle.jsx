import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';

export default function ClienteViewToggle({ viewMode, onChange }) {
  return (
    <div className="flex gap-1 border border-[var(--brand-border-primary)] rounded-lg p-1">
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('cards')}
        className={viewMode === 'cards' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('list')}
        className={viewMode === 'list' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}