import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AndamentoItem({ andamento, onClick }) {
  return (
    <div className="border-l-2 border-[var(--border-primary)] pl-4 pb-4 cursor-pointer hover:border-[var(--brand-primary)]" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[var(--brand-primary-700)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3 h-3 text-[var(--text-tertiary)]" />
            <span className="text-xs text-[var(--text-secondary)]">
              {andamento.data ? format(new Date(andamento.data), 'dd/MM/yyyy') : '-'}
            </span>
          </div>
          <p className="text-sm text-[var(--text-primary)] line-clamp-2">{andamento.descricao}</p>
          {andamento.tipo && <Badge className="mt-2">{andamento.tipo}</Badge>}
        </div>
      </div>
    </div>
  );
}