import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PublicacaoCheckbox({ publicacao, checked, onCheckedChange }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-[var(--bg-secondary)] transition-colors">
      <Checkbox 
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {publicacao.processo_id}
          </p>
          <Badge variant="outline" className="text-xs">
            {format(new Date(publicacao.data_publicacao), 'dd/MM/yy')}
          </Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
          {publicacao.conteudo?.substring(0, 120)}...
        </p>
      </div>
    </div>
  );
}