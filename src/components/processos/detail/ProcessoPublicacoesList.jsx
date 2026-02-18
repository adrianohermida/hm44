import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicacaoItem from './PublicacaoItem';
import PublicacaoFormInline from './PublicacaoFormInline';
import TarefaFormModal from './TarefaFormModal';
import { toast } from 'sonner';
import { addDays } from 'date-fns';

export default function ProcessoPublicacoesList({ processoId, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [showTarefaModal, setShowTarefaModal] = useState(false);
  const [tarefaBase, setTarefaBase] = useState(null);
  const queryClient = useQueryClient();

  const { data: publicacoes = [] } = useQuery({
    queryKey: ['publicacoes', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.PublicacaoProcesso.filter({ 
        processo_id: processoId,
        escritorio_id: user.escritorio_id
      });
    },
    enabled: !!processoId
  });

  const createTarefaMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.TarefaProcesso.create({
        ...data,
        escritorio_id: user.escritorio_id,
        processo_id: processoId,
        status: 'pendente'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tarefas-processo']);
      queryClient.invalidateQueries(['tarefas']);
      setShowTarefaModal(false);
      toast.success('Tarefa criada');
    }
  });

  const handleCreateTarefa = (publicacao) => {
    const dataLimite = publicacao.data_limite || addDays(new Date(), publicacao.prazo_dias || 5);
    setTarefaBase({
      titulo: `Responder: ${publicacao.tipo}`,
      descricao: publicacao.conteudo,
      tipo: 'prazo_processual',
      prioridade: publicacao.ia_analise?.urgencia === 'alta' ? 'urgente' : 'media',
      data_limite: dataLimite.toISOString().split('T')[0],
      vinculada_publicacao_id: publicacao.id
    });
    setShowTarefaModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4" />Publicações ({publicacoes.length})
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {showForm && <PublicacaoFormInline onSave={(data) => {onAdd(data); setShowForm(false);}} onCancel={() => setShowForm(false)} />}
          {publicacoes.length === 0 && !showForm ? (
            <p className="text-sm text-[var(--text-secondary)]">Nenhuma publicação registrada</p>
          ) : (
            publicacoes.map(pub => <PublicacaoItem key={pub.id} publicacao={pub} onCreateTarefa={handleCreateTarefa} />)
          )}
        </CardContent>
      </Card>
      <TarefaFormModal
        open={showTarefaModal}
        onClose={() => setShowTarefaModal(false)}
        tarefa={tarefaBase}
        processoId={processoId}
        onSave={(data) => createTarefaMutation.mutate(data)}
      />
    </>
  );
}