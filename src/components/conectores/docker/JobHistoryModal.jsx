import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import DockerStatusBadge from './DockerStatusBadge';
import JobLogsTimeline from './JobLogsTimeline';

export default function JobHistoryModal({ analiseId, open, onClose }) {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['job-history', analiseId],
    queryFn: async () => {
      return await base44.entities.JobAnaliseDocker.filter({ analise_id: analiseId }, '-created_date');
    },
    enabled: open && !!analiseId
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Histórico de Execuções ({jobs.length})</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-[var(--bg-tertiary)] rounded animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-tertiary)]">
              Nenhuma execução encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job #{job.id.slice(-8)}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {new Date(job.created_date).toLocaleString()}
                      </p>
                    </div>
                    <DockerStatusBadge status={job.status} />
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-tertiary)]">Progresso:</span>
                      <span className="font-medium">{job.progresso_percentual}%</span>
                    </div>
                    {job.etapa_atual && (
                      <div className="flex justify-between">
                        <span className="text-[var(--text-tertiary)]">Etapa:</span>
                        <span className="font-medium">{job.etapa_atual}</span>
                      </div>
                    )}
                  </div>
                  {job.logs?.length > 0 && (
                    <JobLogsTimeline logs={job.logs} />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}