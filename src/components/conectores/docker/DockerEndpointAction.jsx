import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DockerEndpointAction({ analiseId, endpointIndex, endpoint, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const criado = endpoint.status_comparacao === 'OK' && endpoint.endpoint_criado_id;

  const handleCriar = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('criarEndpointDeAnalise', {
        analise_id: analiseId,
        endpoint_index: endpointIndex,
        versao_api: 'V2'
      });

      if (data.error) throw new Error(data.error);

      toast.success('Endpoint criado');
      onSuccess?.();
    } catch (error) {
      toast.error('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (criado) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Check className="w-4 h-4 mr-1" />
        Criado
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={handleCriar} disabled={loading}>
      <Plus className="w-4 h-4 mr-1" />
      {loading ? 'Criando...' : 'Criar'}
    </Button>
  );
}