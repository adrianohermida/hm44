import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JobProgressActions({ job, onUpdate }) {
  const pausar = async () => {
    await base44.entities.JobImportacao.update(job.id, { status: 'PAUSADO' });
    toast.info('Importação pausada');
    if (onUpdate) onUpdate();
  };

  const retomar = async () => {
    await base44.functions.invoke('processarImportacaoLote', { job_id: job.id });
    toast.info('Importação retomada');
    if (onUpdate) onUpdate();
  };

  const cancelar = async () => {
    await base44.entities.JobImportacao.update(job.id, { status: 'CANCELADO' });
    toast.info('Importação cancelada');
    if (onUpdate) onUpdate();
  };

  if (job.status === 'PROCESSANDO') {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={pausar}>
          <Pause className="w-4 h-4 mr-1" />Pausar
        </Button>
        <Button size="sm" variant="destructive" onClick={cancelar}>
          <X className="w-4 h-4 mr-1" />Cancelar
        </Button>
      </div>
    );
  }

  if (job.status === 'PAUSADO' && job.pode_recomecar) {
    return (
      <Button size="sm" onClick={retomar}>
        <Play className="w-4 h-4 mr-1" />Retomar
      </Button>
    );
  }

  return null;
}