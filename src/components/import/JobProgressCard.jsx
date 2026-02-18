import React from 'react';
import JobProgressActions from './JobProgressActions';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function JobProgressCard({ job }) {
  const statusIcons = {
    PENDENTE: <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />,
    PROCESSANDO: <Loader2 className="w-4 h-4 animate-spin text-blue-500" />,
    CONCLUIDO: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    ERRO: <XCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {statusIcons[job.status]}
          <span className="font-medium">{job.tipo_entidade}</span>
        </div>
        <Badge>{job.status}</Badge>
      </div>
      <Progress value={job.progresso_percentual} className="mb-2" />
      <div className="flex items-center justify-between">
        <div className="text-xs text-[var(--text-secondary)]">
          {job.linhas_processadas}/{job.total_linhas} • {job.linhas_sucesso} ✓ • {job.linhas_erro} ✗
        </div>
        <JobProgressActions job={job} />
      </div>
    </Card>
  );
}