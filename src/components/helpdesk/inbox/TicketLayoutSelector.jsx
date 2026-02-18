import React from 'react';
import { LayoutGrid, Inbox, Table } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const layouts = [
  { value: 'card', label: 'Exibir como cartão', icon: LayoutGrid },
  { value: 'inbox', label: 'Caixa de entrada', icon: Inbox },
  { value: 'table', label: 'Exibir como tabela', icon: Table }
];

export default function TicketLayoutSelector({ value, onChange }) {
  const current = layouts.find(l => l.value === value) || layouts[0];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Icon className="w-4 h-4" />
          <span className="hidden md:inline">Layout:</span>
          <span>{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {layouts.map((layout) => {
          const LayoutIcon = layout.icon;
          return (
            <DropdownMenuItem
              key={layout.value}
              onClick={() => onChange(layout.value)}
              className="gap-2"
            >
              <LayoutIcon className="w-4 h-4" />
              {layout.label}
              {value === layout.value && ' ✓'}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}