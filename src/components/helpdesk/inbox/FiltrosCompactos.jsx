import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FiltroButton = ({ active, onClick, children, count }) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    className={cn(
      "h-8 text-xs gap-1.5",
      active && "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)]"
    )}
  >
    {children}
    {count > 0 && <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{count}</Badge>}
  </Button>
);

export default function FiltrosCompactos({ filtros, onFiltrosChange, stats = {} }) {
  const statusOptions = [
    { value: 'aberto,triagem', label: 'Abertos', count: stats.abertos || 0 },
    { value: 'em_atendimento', label: 'Atendendo', count: stats.em_atendimento || 0 },
    { value: 'aguardando_cliente', label: 'Aguardando', count: stats.aguardando || 0 },
    { value: 'resolvido', label: 'Resolvidos', count: stats.resolvidos || 0 }
  ];

  const prioridadeOptions = [
    { value: 'urgente', label: 'Urgente', color: 'text-red-600' },
    { value: 'alta', label: 'Alta', color: 'text-orange-600' },
    { value: 'media,baixa', label: 'Normal', color: 'text-gray-600' }
  ];

  const hasActiveFilters = 
    filtros.prioridade !== 'todos' || 
    filtros.departamento !== 'todos' || 
    filtros.responsavel !== 'todos';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map(opt => (
          <FiltroButton
            key={opt.value}
            active={filtros.status === opt.value}
            onClick={() => onFiltrosChange({ ...filtros, status: opt.value })}
            count={opt.count}
          >
            {opt.label}
          </FiltroButton>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {prioridadeOptions.map(opt => (
          <Button
            key={opt.value}
            variant={filtros.prioridade === opt.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFiltrosChange({ 
              ...filtros, 
              prioridade: filtros.prioridade === opt.value ? 'todos' : opt.value 
            })}
            className={cn(
              "h-7 text-xs",
              filtros.prioridade === opt.value 
                ? "bg-[var(--brand-primary)] text-white" 
                : opt.color
            )}
          >
            {opt.label}
          </Button>
        ))}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltrosChange({ 
              status: 'aberto,triagem',
              prioridade: 'todos',
              departamento: 'todos',
              responsavel: 'todos'
            })}
            className="h-7 text-xs text-[var(--text-secondary)]"
          >
            <X className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}