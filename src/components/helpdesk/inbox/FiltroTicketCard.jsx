import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FiltroTicketCard({ filtro, onAplicar, onFavoritar, onDeletar }) {
  return (
    <Card className="hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0" onClick={() => onAplicar(filtro)}>
            <div className="flex items-center gap-2 mb-1">
              <Filter className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
              <h4 className="font-medium text-sm truncate">{filtro.nome}</h4>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] truncate">
              {Object.entries(filtro.filtros)
                .filter(([_, v]) => v !== 'todos')
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ') || 'Todos os filtros'}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); onFavoritar(filtro); }}
            >
              <Star className={cn("w-4 h-4", filtro.favorito && "fill-yellow-400 text-yellow-400")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-red-600"
              onClick={(e) => { e.stopPropagation(); onDeletar(filtro.id); }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}