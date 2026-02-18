import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SidebarDepartamentos({ departamentos, tickets, filtros, onDepartamentoClick }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  if (departamentos.length === 0) return null;

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        className="w-full justify-start h-7 px-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase hover:bg-transparent"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 mr-1" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 mr-1" />
        )}
        Departamentos
      </Button>

      {expanded && (
        <div className="space-y-0.5 mt-1">
          {departamentos.map(dept => {
            const deptCount = tickets.filter(t => t.departamento_id === dept.id).length;
            const isActive = filtros.departamento === dept.id;
            
            return (
              <Button
                key={dept.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-8 px-2 text-sm font-normal",
                  isActive && "bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-medium"
                )}
                onClick={() => onDepartamentoClick(dept.id)}
              >
                <div
                  className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: dept.cor || '#10b981' }}
                />
                <span className="flex-1 text-left truncate">{dept.nome}</span>
                {deptCount > 0 && (
                  <span className={cn(
                    "text-xs font-semibold ml-2",
                    isActive ? "text-[var(--brand-primary-700)]" : "text-[var(--text-tertiary)]"
                  )}>
                    {deptCount}
                  </span>
                )}
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            className="w-full justify-start h-8 px-2 text-sm font-normal text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)]"
            onClick={() => navigate(createPageUrl('HelpdeskSettings'))}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar departamento
          </Button>
        </div>
      )}
    </div>
  );
}