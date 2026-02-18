import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const TIPOS = [
  { value: 'todos', label: 'Todos' },
  { value: 'decisao', label: 'Decisões' },
  { value: 'prazo', label: 'Prazos' },
  { value: 'audiencia', label: 'Audiências' },
  { value: 'movimentacao', label: 'Movimentações' },
  { value: 'publicacao', label: 'Publicações' }
];

export default function ProcessoHistoricoFiltros({ filtroAtivo, onFiltroChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-[var(--text-tertiary)]" aria-hidden="true" />
      {TIPOS.map(tipo => (
        <Button
          key={tipo.value}
          size="sm"
          variant={filtroAtivo === tipo.value ? 'default' : 'outline'}
          onClick={() => onFiltroChange(tipo.value)}
          className="text-xs"
        >
          {tipo.label}
        </Button>
      ))}
    </div>
  );
}