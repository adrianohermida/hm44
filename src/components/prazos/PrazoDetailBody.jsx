import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export default function PrazoDetailBody({ prazo }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
        <span>Vencimento: {format(new Date(prazo.data_vencimento), 'dd/MM/yyyy')}</span>
      </div>
      
      {prazo.dias_prazo && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span>{prazo.dias_prazo} dias</span>
        </div>
      )}
      
      {prazo.responsaveis?.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <User className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span>{prazo.responsaveis.length} responsável(is)</span>
        </div>
      )}
    </div>
  );
}