import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { obterStatusJob, calcularProgresso } from './ImportacaoService';
import JobProgressBadge from './JobProgressBadge';
import JobProgressStats from './JobProgressStats';
import JobControls from './JobControls';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function JobProgressMonitor({ jobId, onComplete, onError }) {
  const { data: job, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => obterStatusJob(jobId),
    refetchInterval: (query) => {
      const currentJob = query?.state?.data;
      if (!currentJob || ['concluido', 'falhou', 'cancelado'].includes(currentJob.status)) {
        return false;
      }
      return 2000;
    },
    enabled: !!jobId,
    retry: 1,
    staleTime: 1000
  });

  useEffect(() => {
    if (!job) return;
    
    if (job.status === 'concluido') {
      toast.success(`✅ ${job.registros_sucesso || 0} processos importados`, {
        description: job.registros_falha > 0 ? `${job.registros_falha} erros ignorados` : undefined,
        duration: 5000
      });
      onComplete?.(job);
    } else if (job.status === 'falhou') {
      toast.error('❌ Importação falhou', {
        description: job.erro_mensagem || 'Erro desconhecido',
        duration: 8000
      });
      onError?.(job);
    }
  }, [job?.status]);

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-8 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <p className="text-sm text-red-600">Job não encontrado ou foi removido</p>
        </CardContent>
      </Card>
    );
  }

  if (!job) return (
    <Card>
      <CardContent className="py-8 flex justify-center">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Clock className="w-5 h-5 animate-spin" />
          <span>Carregando status...</span>
        </div>
      </CardContent>
    </Card>
  );

  const progresso = calcularProgresso(job);
  const tempo = job.tempo_processamento_ms 
    ? `${(job.tempo_processamento_ms / 1000).toFixed(1)}s` 
    : '...';
  
  const calcularETA = () => {
    if (!job.tempo_inicio || job.registros_processados === 0) return null;
    const inicio = new Date(job.tempo_inicio).getTime();
    const agora = Date.now();
    const decorrido = (agora - inicio) / 1000;
    const taxaPorSegundo = job.registros_processados / decorrido;
    const restantes = job.total_registros - job.registros_processados;
    const etaSegundos = Math.ceil(restantes / taxaPorSegundo);
    
    if (etaSegundos < 60) return `~${etaSegundos}s`;
    return `~${Math.ceil(etaSegundos / 60)}min`;
  };
  
  const eta = calcularETA();

  return (
    <Card className={cn(
      "border-2",
      job.status === 'concluido' ? "border-green-200 bg-green-50" :
      job.status === 'falhou' ? "border-red-200 bg-red-50" :
      "border-blue-200 bg-blue-50"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {job.status === 'concluido' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : job.status === 'falhou' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Clock className="w-5 h-5 animate-spin text-blue-600" />
            )}
            <CardTitle className="text-sm">
              {job.status === 'concluido' ? 'Importação Concluída' : 
               job.status === 'falhou' ? 'Importação Falhou' :
               'Processando em Segundo Plano'}
            </CardTitle>
          </div>
          <JobProgressBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progresso} className="h-2" />
        <JobProgressStats job={job} />
        <JobControls 
          jobId={jobId} 
          status={job.status}
          onJobUpdate={() => onError?.(job)}
        />
        {job.status === 'processando' && (
          <p className="text-xs text-[var(--text-secondary)]">
            Processamento em segundo plano • {eta ? `ETA: ${eta}` : tempo}
          </p>
        )}
        {job.erros?.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-red-600 font-semibold">
              Ver erros ({job.erros.length})
            </summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {job.erros.slice(0, 20).map((e, i) => (
                <div key={i} className="bg-red-50 p-2 rounded">
                  <code className="text-xs">{e.numero_cnj || e.linha}: {e.erro}</code>
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}