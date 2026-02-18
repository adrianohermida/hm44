import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Trash2, Pause, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function DockerAnaliseActions({ analise, onAction }) {
  const queryClient = useQueryClient();

  const handleRecomecar = async () => {
    if (!confirm('Deseja recomeçar esta análise? O progresso atual será perdido.')) return;
    
    try {
      console.log('Recomeçando análise:', analise.id);
      
      const result = await base44.functions.invoke('recomecarAnaliseDocker', {
        analise_id: analise.id
      });

      console.log('Resposta recomeçar:', result);

      if (result.data?.error) {
        throw new Error(result.data.error);
      }

      toast.success('✅ Análise recomeçada! Processando...');
      
      setTimeout(() => {
        queryClient.invalidateQueries(['docker-analises']);
        queryClient.invalidateQueries(['docker-job']);
      }, 500);
      
      onAction?.();
    } catch (error) {
      console.error('Erro ao recomeçar:', error);
      toast.error(`Erro: ${error.message}`);
    }
  };

  const handleExcluir = async () => {
    if (!confirm('Deseja excluir esta análise? Esta ação não pode ser desfeita.')) return;

    try {
      console.log('Excluindo análise:', analise.id);
      
      const result = await base44.functions.invoke('excluirAnaliseDocker', {
        analise_id: analise.id
      });

      console.log('Resposta exclusão:', result);

      if (result.data?.error) {
        throw new Error(result.data.error);
      }

      toast.success('✅ Análise excluída com sucesso');
      
      setTimeout(() => {
        queryClient.invalidateQueries(['docker-analises']);
        queryClient.invalidateQueries(['docker-job']);
      }, 300);
      
      onAction?.();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error(`Erro: ${error.message}`);
    }
  };

  const podeRecomecar = analise.status === 'ERRO' || analise.pode_recomecar;
  const podeExcluir = ['CONCLUIDO', 'ERRO', 'CANCELADO'].includes(analise.status);

  return (
    <div className="flex gap-2">
      {podeRecomecar && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRecomecar}
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Recomeçar
        </Button>
      )}
      {podeExcluir && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleExcluir}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      )}
    </div>
  );
}