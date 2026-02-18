import React from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'formacao', label: 'Formação Acadêmica' },
  { id: 'complementar', label: 'Cursos Complementares' },
  { id: 'atuacao', label: 'Áreas de Atuação' },
  { id: 'idiomas', label: 'Idiomas' },
  { id: 'producoes', label: 'Produções' },
  { id: 'eventos', label: 'Eventos' }
];

export default function TimelineFilters({ selectedCategory, onFilterChange, totalCount }) {
  return (
    <div className="mb-10" role="group" aria-label="Filtros de trajetória profissional">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            size="sm"
            role="tab"
            aria-selected={selectedCategory === category.id}
            aria-controls="timeline-content"
            className={`${
              selectedCategory === category.id
                ? 'bg-[var(--brand-primary)] text-white shadow-lg scale-105'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)]'
            } transition-all duration-200 rounded-full px-4 py-2`}
          >
            {category.label}
          </Button>
        ))}
      </div>
      {totalCount > 0 && (
        <p className="text-center text-sm text-[var(--text-tertiary)]">
          {totalCount} {totalCount === 1 ? 'registro' : 'registros'}
        </p>
      )}
    </div>
  );
}