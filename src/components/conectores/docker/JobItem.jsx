import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function JobItem({ job, onClick }) {
  const statusConfig = {
    PENDENTE: { icon: Loader2, color: 'text-gray-500', spin: true },
    INICIADO: { icon: Loader2, color: 'text-blue-500', spin: true },
    EXTRAINDO_TEXTO: { icon: Loader2, color: 'text-blue-500', spin: true },
    ANALISANDO_IA: { icon: Loader2, color: 'text-purple-500', spin: true },
    VALIDANDO: { icon: Loader2, color: 'text-yellow-500', spin: true },
    COMPARANDO: { icon: Loader2, color: 'text-orange-500', spin: true },
    CONCLUIDO: { icon: CheckCircle, color: 'text-green-500', spin: false },
    ERRO: { icon: AlertCircle, color: 'text-red-500', spin: false }
  };

  const config = statusConfig[job.status] || statusConfig.PENDENTE;
  const Icon = config.icon;

  return (
    <Button variant="ghost" className="w-full justify-start h-auto py-3" onClick={onClick}>
      <div className="flex items-center gap-3 w-full">
        <Icon className={`w-4 h-4 ${config.color} ${config.spin ? 'animate-spin' : ''}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{job.etapa_atual || job.status}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{job.progresso_percentual}%</p>
        </div>
      </div>
    </Button>
  );
}