import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpdeskFiltrosDropdown({ filtros, onFiltrosChange, escritorioId }) {
  const [open, setOpen] = React.useState(false);

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos-filtro', escritorioId],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorioId,
      ativo: true 
    }),
    enabled: !!escritorioId
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const handleFilterChange = (newFiltros) => {
    onFiltrosChange(newFiltros);
    setOpen(false);
  };

  const statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'aberto,triagem', label: 'Não resolvidos' },
    { value: 'aberto', label: 'Aberto' },
    { value: 'em_atendimento', label: 'Em atendimento' },
    { value: 'aguardando_cliente', label: 'Aguardando cliente' },
    { value: 'resolvido', label: 'Resolvido' },
    { value: 'fechado', label: 'Fechado' }
  ];

  const prioridadeOptions = [
    { value: 'todos', label: 'Todas' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' }
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {statusOptions.map(opt => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => handleFilterChange({ ...filtros, status: opt.value })}
            className="cursor-pointer"
          >
            <Check className={cn(
              "w-4 h-4 mr-2",
              filtros.status === opt.value ? "opacity-100" : "opacity-0"
            )} />
            {opt.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
        {prioridadeOptions.map(opt => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => handleFilterChange({ ...filtros, prioridade: opt.value })}
            className="cursor-pointer"
          >
            <Check className={cn(
              "w-4 h-4 mr-2",
              filtros.prioridade === opt.value ? "opacity-100" : "opacity-0"
            )} />
            {opt.label}
          </DropdownMenuItem>
        ))}

        {departamentos.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Departamento</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => handleFilterChange({ ...filtros, departamento: 'todos' })}
              className="cursor-pointer"
            >
              <Check className={cn(
                "w-4 h-4 mr-2",
                filtros.departamento === 'todos' ? "opacity-100" : "opacity-0"
              )} />
              Todos
            </DropdownMenuItem>
            {departamentos.map(dept => (
              <DropdownMenuItem
                key={dept.id}
                onSelect={() => handleFilterChange({ ...filtros, departamento: dept.id })}
                className="cursor-pointer"
              >
                <Check className={cn(
                  "w-4 h-4 mr-2",
                  filtros.departamento === dept.id ? "opacity-100" : "opacity-0"
                )} />
                {dept.nome}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}