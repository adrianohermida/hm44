import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import PrazoUrgenteBadge from '@/components/prazos/PrazoUrgenteBadge';

export default function TarefaItem({ tarefa }) {
  const prioridadeConfig = {
    baixa: { color: 'bg-blue-100 text-blue-800', icon: null },
    media: { color: 'bg-yellow-100 text-yellow-800', icon: null },
    alta: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
    urgente: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };

  const config = prioridadeConfig[tarefa.prioridade] || prioridadeConfig.media;
  const Icon = config.icon;

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-[var(--text-primary)] flex-1">{tarefa.titulo}</p>
        <div className="flex items-center gap-1">
          <PrazoUrgenteBadge dataLimite={tarefa.data_limite} />
          {Icon && <Icon className="w-4 h-4 text-orange-600 flex-shrink-0" />}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={config.color}>{tarefa.prioridade}</Badge>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <Clock className="w-3 h-3" />
          {format(new Date(tarefa.data_limite), 'dd/MM/yyyy')}
        </div>
      </div>
    </div>
  );
}