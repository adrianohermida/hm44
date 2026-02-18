import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIPOS_DIVIDA = [
  { value: 'todos', label: 'Todas as Dívidas' },
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'banco', label: 'Banco' },
  { value: 'financiamento', label: 'Financiamento' },
  { value: 'consignado', label: 'Consignado' },
  { value: 'multiplas', label: 'Múltiplas Dívidas' },
];

export default function TestimonialFilters({ selectedTipo, onFilterChange, totalCount }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Filtrar por tipo de dívida
        </h3>
        <span className="ml-auto text-sm text-[var(--text-secondary)]">
          {totalCount} depoimentos
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {TIPOS_DIVIDA.map((tipo) => (
          <Button
            key={tipo.value}
            variant={selectedTipo === tipo.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(tipo.value)}
            className={selectedTipo === tipo.value ? 'bg-[var(--brand-primary)]' : ''}
          >
            {tipo.label}
          </Button>
        ))}
      </div>
    </div>
  );
}