import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DockerEndpointActions({ endpoint, analiseId, onUpdate }) {
  const handleAdd = async () => {
    try {
      await base44.functions.invoke('adicionarEndpointDocker', {
        analise_id: analiseId,
        endpoint
      });
      toast.success('Endpoint adicionado');
      onUpdate();
    } catch (err) {
      toast.error('Erro ao adicionar');
    }
  };

  const handleUpdate = async () => {
    try {
      await base44.functions.invoke('atualizarEndpointDocker', {
        endpoint_id: endpoint.endpoint_existente_id,
        dados: endpoint
      });
      toast.success('Endpoint atualizado');
      onUpdate();
    } catch (err) {
      toast.error('Erro ao atualizar');
    }
  };

  if (endpoint.status_comparacao === 'OK') return null;
  if (endpoint.status_comparacao === 'DUPLICADO') return null;

  return (
    <div className="flex gap-1">
      {endpoint.status_comparacao === 'NOVO' && (
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      )}
      {endpoint.status_comparacao === 'ATUALIZAR' && (
        <Button size="sm" variant="outline" onClick={handleUpdate}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}