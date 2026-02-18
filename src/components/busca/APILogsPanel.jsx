import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import APILogViewer from './APILogViewer';
import APILogModal from './APILogModal';
import LoadingState from '../common/LoadingState';

export default function APILogsPanel() {
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['api-logs'],
    queryFn: () => base44.entities.LogRequisicaoAPI.list('-created_date', 10)
  });

  if (isLoading) return <LoadingState message="Carregando logs..." />;

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="font-semibold text-[var(--text-primary)]">
            Logs de API
          </h3>
        </div>
        <div className="space-y-3">
          {logs.map((log) => (
            <APILogViewer 
              key={log.id} 
              log={log}
              onViewDetails={setSelectedLog}
            />
          ))}
        </div>
      </Card>

      <APILogModal 
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}