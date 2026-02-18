import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';

export default function ProcessoViewToggle({ mode, onChange }) {
  return (
    <div className="flex gap-1 border border-[var(--border-primary)] rounded-lg p-1">
      <Button
        variant={mode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('cards')}
        className={mode === 'cards' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        variant={mode === 'lista' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('lista')}
        className={mode === 'lista' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}