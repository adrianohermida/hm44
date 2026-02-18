import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import HistoricoTimelineItem from './HistoricoTimelineItem';
import ProcessoHistoricoFiltros from './ProcessoHistoricoFiltros';
import { toast } from 'sonner';
import ConfirmarConsumoModal from './ConfirmarConsumoModal';

export default function ProcessoHistoricoConsolidado({ processoId, processo }) {
  const [filtro, setFiltro] = useState('todos');
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Movimentações do banco local
  const { data: movimentacoes = [], refetch: refetchMovimentacoes } = useQuery({
    queryKey: ['movimentacoes', processoId],
    queryFn: () => base44.entities.MovimentacaoProcesso.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  // Buscar movimentações atualizadas da API Escavador
  const handleRefreshAPI = async () => {
    console.log('[ProcessoHistoricoConsolidado] handleRefreshAPI chamado');
    
    if (!processo?.numero_cnj) {
      toast.error('Número CNJ não encontrado');
      setShowConfirm(false);
      return;
    }
    
    setLoadingAPI(true);
    setShowConfirm(false);
    
    try {
      console.log('[ProcessoHistoricoConsolidado] Invocando listarMovimentacoes:', {
        numero_cnj: processo.numero_cnj,
        processo_id: processoId
      });
      
      const response = await base44.functions.invoke('listarMovimentacoes', { 
        numero_cnj: processo.numero_cnj,
        buscar_todas: true,
        processo_id: processoId
      });
      
      console.log('[ProcessoHistoricoConsolidado] Response:', response);
      
      const data = response.data;
      
      if (data?.success) {
        await refetchMovimentacoes();
        toast.success(`${data.movimentacoes_salvas || 0} movimentações salvas (${data.total_movimentacoes || 0} encontradas)`);
      } else if (data?.error) {
        toast.error(data.error);
      } else {
        toast.info('Nenhuma movimentação nova encontrada');
      }
    } catch (error) {
      console.error('[ProcessoHistoricoConsolidado] Erro:', error);
      toast.error(error?.response?.data?.error || error.message || 'Erro ao buscar movimentações da API');
    } finally {
      setLoadingAPI(false);
    }
  };

  const { data: audiencias = [] } = useQuery({
    queryKey: ['audiencias', processoId],
    queryFn: () => base44.entities.AudienciaProcesso.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const { data: publicacoes = [] } = useQuery({
    queryKey: ['publicacoes', processoId],
    queryFn: () => base44.entities.PublicacaoProcesso.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-processo', processoId],
    queryFn: () => base44.entities.TarefaProcesso.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const allEvents = [
    ...movimentacoes.map(m => ({ ...m, tipo: 'movimentacao', data: m.data })),
    ...audiencias.map(a => ({ ...a, tipo: 'audiencia', data: a.data })),
    ...publicacoes.map(p => ({ 
      ...p, 
      tipo: p.tipo === 'sentenca' || p.tipo === 'acordao' ? 'decisao' : 'publicacao', 
      data: p.data 
    })),
    ...tarefas.map(t => ({ 
      ...t, 
      tipo: t.tipo === 'audiencia' ? 'audiencia' : t.tipo === 'prazo_processual' ? 'prazo' : 'tarefa', 
      data: t.data_limite 
    }))
  ];

  const filteredEvents = filtro === 'todos' 
    ? allEvents 
    : allEvents.filter(e => e.tipo === filtro);

  const sortedEvents = filteredEvents.sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <>
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Histórico Consolidado</CardTitle>
          {processo?.numero_cnj && filtro === 'movimentacao' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={loadingAPI}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingAPI ? 'animate-spin' : ''}`} />
              {loadingAPI ? 'Buscando...' : 'Buscar no Tribunal'}
            </Button>
          )}
        </div>
        <ProcessoHistoricoFiltros filtroAtivo={filtro} onFiltroChange={setFiltro} />
      </CardHeader>
      <CardContent>
        {sortedEvents.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center py-8">
            {filtro === 'todos' ? 'Nenhum evento registrado' : `Nenhum evento do tipo "${filtro}" encontrado`}
          </p>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((evento, idx) => (
              <HistoricoTimelineItem key={`${evento.tipo}-${evento.id}-${idx}`} evento={evento} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <ConfirmarConsumoModal
      open={showConfirm}
      onOpenChange={setShowConfirm}
      onConfirm={handleRefreshAPI}
      loading={loadingAPI}
      titulo="Buscar Movimentações no Tribunal"
      descricao="Esta consulta irá buscar movimentações atualizadas do processo no tribunal."
      creditos={1}
    />
    </>
  );
}