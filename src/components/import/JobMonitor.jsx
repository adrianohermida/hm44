import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import JobProgressCard from './JobProgressCard';
import ErrorsList from './ErrorsList';

export default function JobMonitor({ jobId, onComplete }) {
  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const j = await base44.entities.JobImportacao.filter({ id: jobId });
      return j[0];
    },
    enabled: !!jobId,
    refetchInterval: (data) => {
      if (data?.status === 'CONCLUIDO' || data?.status === 'ERRO' || data?.status === 'CANCELADO') {
        if (onComplete) onComplete();
        return false;
      }
      return 1000;
    }
  });

  if (!job) return <div className="text-center py-4">Carregando...</div>;

  return (
    <div className="space-y-3">
      <JobProgressCard job={job} />
      {job.erros_detalhados?.length > 0 && <ErrorsList erros={job.erros_detalhados} />}
    </div>
  );
}