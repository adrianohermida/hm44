import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import VincularProcessoBusca from './VincularProcessoBusca';
import VincularProcessoResultado from './VincularProcessoResultado';

export default function VincularProcessoModal({ processo, open, onOpenChange }) {
  const [buscando, setBuscando] = useState(false);
  const [processoEncontrado, setProcessoEncontrado] = useState(null);
  const queryClient = useQueryClient();

  const vincularMutation = useMutation({
    mutationFn: async ({ processo_pai_id, relation_type }) => {
      return await base44.entities.Processo.update(processo.id, {
        processo_pai_id,
        relation_type
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processo', processo.id]);
      queryClient.invalidateQueries(['processos']);
      toast.success('Processo vinculado com sucesso');
      onOpenChange(false);
      setProcessoEncontrado(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao vincular processo');
    }
  });

  const handleBuscar = async (cnj) => {
    setBuscando(true);
    try {
      const processos = await base44.entities.Processo.filter({ numero_cnj: cnj });
      if (processos.length > 0) {
        setProcessoEncontrado(processos[0]);
      } else {
        toast.error('Processo não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar processo');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Processo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <VincularProcessoBusca onBuscar={handleBuscar} buscando={buscando} />
          {processoEncontrado && (
            <VincularProcessoResultado
              processo={processoEncontrado}
              onVincular={vincularMutation.mutate}
              loading={vincularMutation.isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}