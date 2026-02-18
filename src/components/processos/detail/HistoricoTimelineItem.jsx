import React from 'react';
import { FileText, Calendar, Bell, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoricoTimelineItem({ evento }) {
  const icons = { movimentacao: FileText, audiencia: Calendar, publicacao: Bell, tarefa: CheckCircle };
  const Icon = icons[evento.tipo];
  
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[var(--brand-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {evento.descricao || evento.titulo || evento.conteudo?.substring(0, 50)}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {format(new Date(evento.data || evento.created_date), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>
    </div>
  );
}