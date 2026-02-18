import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MovimentacaoTimelineItem({ movimentacao, onViewDetails }) {
  return (
    <div className="flex gap-3 pb-4 border-b border-[var(--border-primary)] last:border-0 last:pb-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center">
        <Calendar className="w-4 h-4 text-[var(--brand-primary-700)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {movimentacao.tipo_movimentacao || movimentacao.tipo}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--text-secondary)]">
              {new Date(movimentacao.data).toLocaleDateString()}
            </span>
            {onViewDetails && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
                onClick={() => onViewDetails(movimentacao)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {movimentacao.descricao && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{movimentacao.descricao}</p>
        )}
      </div>
    </div>
  );
}