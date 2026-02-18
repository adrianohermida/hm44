import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import CalculoPrazosStats from './CalculoPrazosStats';
import PublicacoesList from './PublicacoesList';
import CalculoPrazosActions from './CalculoPrazosActions';

export default function CalculoPrazosPanel({ workspace }) {
  const [calcularComIA, setCalcularComIA] = useState(true);
  const [vincularTarefas, setVincularTarefas] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const { data: publicacoes = [], isLoading } = useQuery({
    queryKey: ['publicacoes-pendentes', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      return base44.entities.PublicacaoProcesso.filter({
        escritorio_id: workspace.id,
        prazo_calculado: false
      });
    },
    enabled: !!workspace?.id
  });

  const { data: aprendizados = [] } = useQuery({
    queryKey: ['aprendizados', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      return base44.entities.AprendizadoCalculoPrazo.filter({
        escritorio_id: workspace.id
      });
    },
    enabled: !!workspace?.id
  });

  const stats = useMemo(() => ({
    pendentes: publicacoes.length,
    calculados: selectedIds.length,
    taxaIA: aprendizados.length > 0 
      ? Math.round((aprendizados.filter(a => a.confirmacao_usuario?.aceito).length / aprendizados.length) * 100)
      : 0,
    precisao: aprendizados.length > 0
      ? Math.round((aprendizados.filter(a => !a.confirmacao_usuario?.ajustou).length / aprendizados.length) * 100)
      : 0
  }), [publicacoes, selectedIds, aprendizados]);

  const calcularMutation = useMutation({
    mutationFn: async () => {
      return base44.functions.invoke('calcularPrazosEmMassa', {
        escritorio_id: workspace.id,
        publicacao_ids: selectedIds.length > 0 ? selectedIds : null,
        usar_ia: calcularComIA,
        vincular_tarefas: vincularTarefas
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['publicacoes-pendentes']);
      queryClient.invalidateQueries(['prazos']);
      setSelectedIds([]);
      toast.success('Prazos calculados com sucesso');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao calcular prazos');
    }
  });

  const treinarMutation = useMutation({
    mutationFn: async () => {
      return base44.functions.invoke('treinarIAPrazos', {
        escritorio_id: workspace.id
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['regras-prazo']);
      toast.success(`IA treinada: ${data.data.regras_atualizadas} regras atualizadas`);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao treinar IA');
    }
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(prev => 
      prev.length === publicacoes.length ? [] : publicacoes.map(p => p.id)
    );
  };

  return (
    <div className="space-y-6">
      <CalculoPrazosStats stats={stats} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Publicações Pendentes</CardTitle>
            <Button variant="outline" size="sm" onClick={toggleAll}>
              {selectedIds.length === publicacoes.length ? 'Desmarcar' : 'Selecionar'} Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PublicacoesList
            publicacoes={publicacoes}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            isLoading={isLoading}
          />

          <CalculoPrazosActions
            calcularComIA={calcularComIA}
            onCalcularComIAChange={setCalcularComIA}
            vincularTarefas={vincularTarefas}
            onVincularTarefasChange={setVincularTarefas}
            onCalcular={() => calcularMutation.mutate()}
            onTreinar={() => treinarMutation.mutate()}
            calculando={calcularMutation.isPending}
            treinando={treinarMutation.isPending}
            selectedCount={selectedIds.length}
            totalPublicacoes={publicacoes.length}
            totalAprendizados={aprendizados.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}