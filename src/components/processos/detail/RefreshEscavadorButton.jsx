import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmarConsumoModal from './ConfirmarConsumoModal';

export default function RefreshEscavadorButton({ processoId }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setLoading(true);
    setShowModal(false);
    
    try {
      const { data } = await base44.functions.invoke('refreshProcessoEscavador', {
        processo_id: processoId
      }, {
        mutationKey: ['refresh-processo']
      });

      if (data.sucesso) {
        queryClient.invalidateQueries(['processo', processoId]);
        queryClient.invalidateQueries(['partes']);
        queryClient.invalidateQueries(['audiencias']);
        queryClient.invalidateQueries(['movimentacoes']);
        toast.success(`✅ Atualizado (${data.campos_atualizados} campos em ${data.tempo_ms}ms)`);
      } else {
        toast.error(data.erro || 'Erro ao atualizar');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar processo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowModal(true)}
        disabled={loading}
        title="Enriquecer dados via Escavador (consome créditos)"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Enriquecendo...' : 'Enriquecer'}
      </Button>

      <ConfirmarConsumoModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleRefresh}
        loading={loading}
        titulo="Enriquecer Processo via Escavador"
        descricao="Esta consulta irá buscar dados enriquecidos do processo diretamente no tribunal via API Escavador (consumirá créditos)."
        creditos={1}
      />
    </>
  );
}