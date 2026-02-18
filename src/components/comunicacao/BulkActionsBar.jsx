import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Archive, AlertTriangle, X } from 'lucide-react';

export default function BulkActionsBar({ selectedCount, onMarkRead, onArchive, onEscalate, onClear, loading }) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-[var(--brand-primary)] text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="font-semibold">{selectedCount} selecionado{selectedCount > 1 ? 's' : ''}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onMarkRead}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Marcar como Lido
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onEscalate}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Escalar
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onArchive}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <Archive className="w-4 h-4 mr-1" />
          Arquivar
        </Button>
      </div>
    </div>
  );
}