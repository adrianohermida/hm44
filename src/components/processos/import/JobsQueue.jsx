import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import JobRecoveryModal from './JobRecoveryModal';
import QueueBulkActions from './QueueBulkActions';

export default function JobsQueue({ escritorioId, onJobClick }) {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const { data: jobs = [], refetch } = useQuery({
    queryKey: ['jobs-queue', escritorioId],
    queryFn: async () => {
      const allJobs = await base44.entities.JobImportacao.filter(
        { escritorio_id: escritorioId },
        '-created_date',
        10
      );
      return allJobs;
    },
    enabled: !!escritorioId,
    refetchInterval: (query) => {
      const hasActive = Array.isArray(query?.state?.data) && 
        query.state.data.some(j => j.status === 'processando' || j.status === 'pendente');
      return hasActive ? 2000 : false;
    },
    staleTime: 5000
  });

  const handleDelete = async (jobId, e) => {
    e?.stopPropagation();
    try {
      await base44.entities.JobImportacao.delete(jobId);
      toast.success('Job removido');
      if (selectedJobId === jobId) setSelectedJobId(null);
      refetch();
    } catch (error) {
      toast.error('Erro ao remover job');
    }
  };

  if (jobs.length === 0) return null;

  const activeJobs = jobs.filter(j => j.status === 'processando' || j.status === 'pendente');
  const completedJobs = jobs.filter(j => j.status === 'concluido' || j.status === 'falhou');

  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Fila de Importações ({jobs.length})
            </CardTitle>
            <QueueBulkActions jobs={jobs} escritorioId={escritorioId} />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {activeJobs.map(job => (
                <JobItem 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDelete}
                  onClick={() => setSelectedJobId(job.id)}
                />
              ))}
              
              {activeJobs.length > 0 && completedJobs.length > 0 && (
                <div className="border-t border-[var(--border-primary)] my-2 pt-2">
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">Concluídos</p>
                </div>
              )}
              
              {completedJobs.map(job => (
                <JobItem 
                  key={job.id} 
                  job={job} 
                  onDelete={handleDelete}
                  onClick={() => setSelectedJobId(job.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <JobRecoveryModal
        jobId={selectedJobId}
        open={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </>
  );
}

function JobItem({ job, onDelete, onClick }) {
  const statusConfig = {
    pendente: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' },
    processando: { icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50', spin: true },
    concluido: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    falhou: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' }
  };

  const config = statusConfig[job.status] || statusConfig.pendente;
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border border-[var(--border-primary)] cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]",
        config.bg
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color, config.spin && "animate-spin")} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {job.total_registros} processos
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs", config.color)}>
                {job.status === 'processando' ? `${job.progresso_percentual || 0}%` :
                 job.status === 'concluido' ? `${job.registros_sucesso || 0} importados` :
                 job.status === 'falhou' ? 'Erro' : 'Na fila'}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">
                {new Date(job.created_date).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
        
        {(job.status === 'concluido' || job.status === 'falhou') && (
          <Button
          size="sm"
          variant="ghost"
          onClick={(e) => onDelete(job.id, e)}
          className="h-6 w-6 p-0"
          title="Remover job"
          >
          <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}