import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import JobProgressBar from './JobProgressBar';
import JobLogsTimeline from './JobLogsTimeline';
import DockerStatusBadge from './DockerStatusBadge';

export default function JobDetailPanel({ job }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job de Análise</CardTitle>
            <DockerStatusBadge status={job.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <JobProgressBar job={job} />
          {job.erro_mensagem && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{job.erro_mensagem}</p>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-[var(--text-tertiary)]">Início:</span>
              <p className="font-medium">{new Date(job.tempo_inicio).toLocaleString()}</p>
            </div>
            {job.tempo_fim && (
              <div>
                <span className="text-[var(--text-tertiary)]">Fim:</span>
                <p className="font-medium">{new Date(job.tempo_fim).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <JobLogsTimeline logs={job.logs || []} />
    </div>
  );
}