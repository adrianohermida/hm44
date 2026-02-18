import React from 'react';
import { Button } from '@/components/ui/button';
import { Archive, Trash2, Eye, EyeOff, Sparkles, FileSearch, X, Merge } from 'lucide-react';

export default function BulkActionsBar({ count, onAction, onClear }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 md:p-4 bg-[var(--brand-primary-50)] border border-[var(--brand-primary-200)] rounded-lg">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm md:text-base text-[var(--brand-primary-700)]">
          {count} selecionado{count !== 1 ? 's' : ''}
        </span>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => onAction('mesclar')}>
          <Merge className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Mesclar</span>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onAction('monitorar')}>
          <Eye className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Monitorar</span>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onAction('arquivar')}>
          <Archive className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Arquivar</span>
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onAction('excluir')}>
          <Trash2 className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Excluir</span>
        </Button>
      </div>
    </div>
  );
}