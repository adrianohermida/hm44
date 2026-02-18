import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function JobControls({ jobId, status, onJobUpdate }) {
  const queryClient = useQueryClient();

  const handleCancelar = async () => {
    try {
      await base44.entities.JobImportacao.update(jobId, {
        status: 'cancelado'
      });
      toast.info('Importação cancelada');
      queryClient.invalidateQueries(['job', jobId]);
      onJobUpdate?.();
    } catch (error) {
      toast.error('Erro ao cancelar: ' + error.message);
    }
  };

  const handleReiniciar = async () => {
    try {
      await base44.entities.JobImportacao.update(jobId, {
        status: 'pendente',
        registros_processados: 0,
        registros_sucesso: 0,
        registros_falha: 0,
        progresso_percentual: 0,
        erros: []
      });
      
      await base44.functions.invoke('processarJobImportacao', { jobId });
      toast.success('Importação reiniciada');
      queryClient.invalidateQueries(['job', jobId]);
    } catch (error) {
      toast.error('Erro ao reiniciar: ' + error.message);
    }
  };

  const handleLimpar = async () => {
    try {
      await base44.entities.JobImportacao.delete(jobId);
      toast.success('Job removido');
      queryClient.invalidateQueries(['jobs']);
      onJobUpdate?.();
    } catch (error) {
      toast.error('Erro ao remover: ' + error.message);
    }
  };

  return (
    <div className="flex gap-2">
      {status === 'processando' && (
        <Button size="sm" variant="destructive" onClick={handleCancelar}>
          <XCircle className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      )}
      {(status === 'falhou' || status === 'cancelado') && (
        <Button size="sm" variant="outline" onClick={handleReiniciar}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar
        </Button>
      )}
      {(status === 'concluido' || status === 'falhou' || status === 'cancelado') && (
        <Button size="sm" variant="ghost" onClick={handleLimpar}>
          <Trash2 className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      )}
    </div>
  );
}