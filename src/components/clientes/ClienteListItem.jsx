import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClienteListItem({ cliente, selected, onToggle, onClick, isSelected }) {
  const getStatusColor = (status) => {
    const colors = {
      ativo: 'bg-[var(--brand-success)]',
      inativo: 'bg-[var(--brand-text-tertiary)]',
      potencial: 'bg-[var(--brand-info)]',
      arquivado: 'bg-[var(--brand-text-secondary)]'
    };
    return colors[status] || 'bg-[var(--brand-text-tertiary)]';
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 hover:bg-[var(--bg-tertiary)] rounded-lg border transition-colors cursor-pointer",
      isSelected ? "border-[var(--brand-primary)] bg-[var(--brand-primary-50)]" : "border-[var(--border-primary)]"
    )}>
      {onToggle && <Checkbox checked={selected} onCheckedChange={() => onToggle(cliente.id)} onClick={(e) => e.stopPropagation()} />}
      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-[var(--brand-primary-700)]" />
      </div>
      <div className="flex-1 min-w-0" onClick={onClick}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-primary)] truncate">{cliente.nome_completo}</span>
          <Badge className={`${getStatusColor(cliente.status)} text-white text-xs`}>
            {cliente.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-[var(--text-secondary)]">
          {cliente.email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="w-3 h-3" />
              {cliente.email}
            </span>
          )}
          {cliente.telefone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {cliente.telefone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}