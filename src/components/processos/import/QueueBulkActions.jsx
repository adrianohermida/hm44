import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, XCircle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function QueueBulkActions({ jobs, escritorioId }) {
  const queryClient = useQueryClient();

  const handleLimparConcluidos = async () => {
    const concluidos = jobs.filter(j => j.status === 'concluido' || j.status === 'falhou');
    
    if (concluidos.length === 0) {
      toast.info('Nenhum job concluído para limpar');
      return;
    }

    try {
      for (const job of concluidos) {
        await base44.entities.JobImportacao.delete(job.id);
      }
      toast.success(`${concluidos.length} jobs removidos`);
      queryClient.invalidateQueries(['jobs-queue', escritorioId]);
    } catch (error) {
      toast.error('Erro ao limpar fila');
    }
  };

  const handleCancelarTodos = async () => {
    const ativos = jobs.filter(j => j.status === 'processando' || j.status === 'pendente');
    
    if (ativos.length === 0) {
      toast.info('Nenhum job ativo para cancelar');
      return;
    }

    try {
      for (const job of ativos) {
        await base44.entities.JobImportacao.update(job.id, { status: 'cancelado' });
      }
      toast.success(`${ativos.length} jobs cancelados`);
      queryClient.invalidateQueries(['jobs-queue', escritorioId]);
    } catch (error) {
      toast.error('Erro ao cancelar jobs');
    }
  };

  const handleLimparTodos = async () => {
    if (!confirm(`Remover TODOS os ${jobs.length} jobs da fila?`)) return;

    try {
      for (const job of jobs) {
        await base44.entities.JobImportacao.delete(job.id);
      }
      toast.success('Fila limpa');
      queryClient.invalidateQueries(['jobs-queue', escritorioId]);
    } catch (error) {
      toast.error('Erro ao limpar fila');
    }
  };

  if (jobs.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      <Button size="sm" variant="outline" onClick={handleLimparConcluidos}>
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Limpar Concluídos
      </Button>
      <Button size="sm" variant="outline" onClick={handleCancelarTodos}>
        <XCircle className="w-3 h-3 mr-1" />
        Cancelar Ativos
      </Button>
      <Button size="sm" variant="ghost" onClick={handleLimparTodos}>
        <Trash2 className="w-3 h-3 mr-1" />
        Limpar Tudo
      </Button>
    </div>
  );
}