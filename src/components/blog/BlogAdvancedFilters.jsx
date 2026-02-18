import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function BlogAdvancedFilters({ filters, onChange, onClear }) {
  const hasActiveFilters = filters.autor || filters.tag;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.autor && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] rounded-full text-sm">
          <span>Autor: {filters.autor}</span>
          <button
            onClick={() => onChange({ ...filters, autor: '' })}
            className="hover:bg-[var(--brand-primary-200)] rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      {filters.tag && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] rounded-full text-sm">
          <span>Tag: {filters.tag}</span>
          <button
            onClick={() => onChange({ ...filters, tag: '' })}
            className="hover:bg-[var(--brand-primary-200)] rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        Limpar todos
      </Button>
    </div>
  );
}