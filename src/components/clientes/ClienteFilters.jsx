import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Users, Archive, UserCircle, Building2 } from 'lucide-react';

export default function ClienteFilters({ filtros, onFiltrosChange }) {
  const filterOptions = [
    { value: 'todos', label: 'Todos', icon: Users },
    { value: 'ativo', label: 'Ativos', icon: UserCircle },
    { value: 'pf', label: 'Pessoa Física', icon: UserCircle },
    { value: 'pj', label: 'Pessoa Jurídica', icon: Building2 },
    { value: 'arquivado', label: 'Arquivados', icon: Archive }
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-1">
        {filterOptions.map(option => {
          const Icon = option.icon;
          const isActive = filtros === option.value || 
            (option.value === 'todos' && !filtros);

          return (
            <Button
              key={option.value}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-2 ${
                isActive ? 'bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]' : ''
              }`}
              onClick={() => onFiltrosChange(option.value)}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}