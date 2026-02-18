import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ProcessoPartesListEnhanced from './ProcessoPartesListEnhanced';
import AdicionarParteModal from './AdicionarParteModal';
import SincronizarPartesButton from './SincronizarPartesButton';
import DebitoTecnicoIndicator from './DebitoTecnicoIndicator';

export default function ProcessoPartesCard({ processo }) {
  const [showModal, setShowModal] = useState(false);
  const [editingParte, setEditingParte] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: partes = [], isLoading } = useQuery({
    queryKey: ['partes', processo.id],
    queryFn: () => base44.entities.ProcessoParte.filter({ processo_id: processo.id }),
    enabled: !!processo.id,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Sincronizar automaticamente débitos técnicos
  React.useEffect(() => {
    const syncDebitosTecnicos = async () => {
      if (!processo?.id || partes.length > 0) return;
      
      // Se processo tem polo_ativo/passivo mas não tem partes, criar automaticamente
      const partesToCreate = [];
      
      if (processo.polo_ativo) {
        partesToCreate.push({
          processo_id: processo.id,
          escritorio_id: processo.escritorio_id,
          nome: processo.polo_ativo,
          tipo_parte: 'polo_ativo'
        });
      }
      
      if (processo.polo_passivo) {
        partesToCreate.push({
          processo_id: processo.id,
          escritorio_id: processo.escritorio_id,
          nome: processo.polo_passivo,
          tipo_parte: 'polo_passivo'
        });
      }
      
      if (partesToCreate.length > 0) {
        try {
          await Promise.all(
            partesToCreate.map(p => base44.entities.ProcessoParte.create(p))
          );
          queryClient.invalidateQueries(['partes', processo.id]);
        } catch (error) {
          console.error('Erro ao sincronizar débitos técnicos:', error);
        }
      }
    };

    syncDebitosTecnicos();
  }, [processo?.id, partes.length]);

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProcessoParte.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['partes', processo.id]);
      queryClient.invalidateQueries(['partes']);
      toast.success('Parte removida');
    },
    onError: (error) => {
      console.error('Erro ao deletar parte:', error);
      toast.error(error.message || 'Erro ao remover parte');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProcessoParte.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['partes', processo.id]);
      queryClient.invalidateQueries(['partes']);
      toast.success('Parte atualizada');
      setShowModal(false);
      setEditingParte(null);
    },
    onError: (error) => {
      console.error('Erro ao atualizar parte:', error);
      toast.error(error.message || 'Erro ao atualizar parte');
    }
  });



  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProcessoParte.create({
      ...data,
      processo_id: processo.id,
      escritorio_id: processo.escritorio_id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['partes', processo.id]);
      queryClient.invalidateQueries(['partes']);
      toast.success('Parte adicionada');
      setShowModal(false);
      setEditingParte(null);
    },
    onError: (error) => {
      console.error('Erro ao criar parte:', error);
      toast.error(error.message || 'Erro ao adicionar parte');
    }
  });

  const handleSyncComplete = () => {
    queryClient.invalidateQueries(['partes']);
  };

  const handleChangePolo = (parte) => {
    const polos = ['polo_ativo', 'polo_passivo', 'terceiro_interessado'];
    const currentIndex = polos.indexOf(parte.tipo_parte);
    const nextPolo = polos[(currentIndex + 1) % polos.length];
    
    updateMutation.mutate({
      id: parte.id,
      data: { tipo_parte: nextPolo }
    });
  };

  const removerAdvogadoMutation = useMutation({
    mutationFn: async ({ parteId, advogados }) => {
      await base44.entities.ProcessoParte.update(parteId, { advogados });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partes', processo.id]);
      toast.success('Advogado removido');
    },
    onError: () => toast.error('Erro ao remover advogado')
  });

  const handleRemoverAdvogado = (parte, advogadoIndex) => {
    const novosAdvogados = [...(parte.advogados || [])];
    novosAdvogados.splice(advogadoIndex, 1);
    removerAdvogadoMutation.mutate({ parteId: parte.id, advogados: novosAdvogados });
  };

  const handleSave = (data) => {
    if (!data.nome || !data.nome.trim()) {
      toast.error('Nome da parte é obrigatório');
      return;
    }

    const parteData = {
      ...data,
      processo_id: processo.id,
      escritorio_id: processo.escritorio_id
    };

    if (editingParte) {
      updateMutation.mutate({ id: editingParte.id, data: parteData });
    } else {
      createMutation.mutate(parteData);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Carregando partes...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Partes do Processo
            </CardTitle>
            <div className="flex items-center gap-2">
              <SincronizarPartesButton 
                processo={processo}
                onComplete={handleSyncComplete}
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setEditingParte(null);
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {partes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Nenhuma parte cadastrada
              </p>
              <SincronizarPartesButton 
                processo={processo}
                onComplete={handleSyncComplete}
              />
            </div>
          ) : (
            <ProcessoPartesListEnhanced
              partes={partes}
              onAdd={() => {
                setEditingParte(null);
                setShowModal(true);
              }}
              onEdit={(p) => {
                setEditingParte(p);
                setShowModal(true);
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
              onChangePolo={handleChangePolo}
              onRemoverAdvogado={handleRemoverAdvogado}
              processoId={processo.id}
            />
          )}
        </CardContent>
      </Card>

      <AdicionarParteModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingParte(null);
        }}
        processoId={processo.id}
        escritorioId={processo.escritorio_id}
        parte={editingParte}
        onSave={handleSave}
      />
    </>
  );
}