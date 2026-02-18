import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ProcessoClientesEmpty from './clientes/ProcessoClientesEmpty';
import ProcessoClientesList from './clientes/ProcessoClientesList';
import ProcessoMarcarClienteModal from './clientes/ProcessoMarcarClienteModal';
import AutoDetectarClientesButton from './AutoDetectarClientesButton';
import { useProcessoClientesActions } from './clientes/ProcessoClientesActions';

export default function ProcessoClientesCard({ processo, partes = [], clientes = [] }) {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const actions = useProcessoClientesActions();

  const marcarMutation = useMutation({
    mutationFn: async ({ parteIds, advogadoId }) => {
      const { data } = await base44.functions.invoke('marcarPartesComoClientes', {
        parte_ids: parteIds,
        advogado_id: advogadoId,
        criar_cliente: true
      });
      return data;
    },
    onMutate: () => {
      // Prevenir cliques duplos
      setShowModal(false);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['partes'] });
      await queryClient.invalidateQueries({ queryKey: ['processo-clientes'] });
      await queryClient.refetchQueries({ queryKey: ['partes', processo.id] });
      toast.success(`${data?.total || 1} parte(s) marcada(s) como cliente`);
    },
    onError: (err) => {
      toast.error(err.message);
      setShowModal(true);
    }
  });

  const desmarcarMutation = useMutation({
    mutationFn: async (parteId) => {
      const partesData = await base44.entities.ProcessoParte.filter({ id: parteId });
      if (partesData.length > 0) {
        const parte = partesData[0];
        const advogadosAtuais = parte.advogados || [];
        const advogadosFiltrados = advogadosAtuais.filter(adv => {
          const temOABEscritorio = adv.oabs?.some(o => o.numero === 8894 && o.uf === 'AM');
          const temEmailEscritorio = adv.email && adv.email.length > 0;
          return !temOABEscritorio && !temEmailEscritorio;
        });
        
        await base44.entities.ProcessoParte.update(parteId, {
          e_cliente_escritorio: false,
          cliente_id: null,
          advogados: advogadosFiltrados
        });
      }
      return { parteId };
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries(['partes', processo.id]),
        queryClient.invalidateQueries(['processo-clientes', processo.id]),
        queryClient.refetchQueries(['partes', processo.id]),
        queryClient.refetchQueries(['processo-clientes', processo.id])
      ]);
      toast.success('Cliente removido');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao remover cliente');
    }
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Clientes
              {clientes.length > 0 && <Badge>{clientes.length}</Badge>}
            </CardTitle>
            <div className="flex gap-2">
              <AutoDetectarClientesButton processoId={processo.id} partes={partes} />
              <Button size="sm" variant="outline" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Marcar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <ProcessoClientesEmpty onMarcar={() => setShowModal(true)} />
          ) : (
            <ProcessoClientesList
              clientes={clientes}
              processoId={processo.id}
              onRemove={(parteId) => desmarcarMutation.mutate(parteId)}
              actions={actions}
            />
          )}
        </CardContent>
      </Card>

      <ProcessoMarcarClienteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        partes={partes}
        escritorioId={processo.escritorio_id}
        onMarcar={(params) => marcarMutation.mutate(params)}
        loading={marcarMutation.isPending}
      />
    </>
  );
}