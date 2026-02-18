import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SidebarFilters({ filtros, isActive, onFilterClick }) {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase">
          Padrão
        </span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Marcar como favorito">
          <Star className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="space-y-0.5">
        {filtros.map((filtro) => {
          const Icon = filtro.icon;
          const active = isActive(filtro.id);
          
          return (
            <Button
              key={filtro.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-8 px-2 text-sm font-normal",
                active && "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-medium"
              )}
              onClick={filtro.action}
            >
              <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{filtro.label}</span>
              {filtro.count > 0 && (
                <span className={cn(
                  "text-xs font-semibold ml-2",
                  active ? "text-[var(--brand-primary-700)]" : "text-[var(--text-tertiary)]"
                )}>
                  {filtro.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}