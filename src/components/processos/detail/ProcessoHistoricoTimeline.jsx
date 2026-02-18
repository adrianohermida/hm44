import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Search, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import HistoricoTimelineItem from './HistoricoTimelineItem';

export default function ProcessoHistoricoTimeline({ processoId }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleBuscarCNJ = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('syncProcessoDatajud', {
        processo_id: processoId
      });

      if (data?.sucesso) {
        queryClient.invalidateQueries(['historico-consolidado', processoId]);
        queryClient.invalidateQueries(['movimentacoes', processoId]);
        toast.success('Movimentações atualizadas via DataJud CNJ');
      } else {
        toast.error('Nenhuma movimentação encontrada no DataJud');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const { data: eventos = [] } = useQuery({
    queryKey: ['historico-consolidado', processoId],
    queryFn: async () => {
      const [movs, auds, pubs, tarefas] = await Promise.all([
        base44.entities.MovimentacaoProcesso.filter({ processo_id: processoId }),
        base44.entities.AudienciaProcesso.filter({ processo_id: processoId }),
        base44.entities.PublicacaoProcesso.filter({ processo_id: processoId }),
        base44.entities.TarefaProcesso.filter({ processo_id: processoId, status: 'concluida' })
      ]);
      return [...movs.map(m => ({...m, tipo: 'movimentacao'})), 
              ...auds.map(a => ({...a, tipo: 'audiencia'})),
              ...pubs.map(p => ({...p, tipo: 'publicacao'})),
              ...tarefas.map(t => ({...t, tipo: 'tarefa'}))].sort((a, b) => 
        new Date(b.data || b.created_date) - new Date(a.data || a.created_date)
      );
    },
    enabled: !!processoId
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Histórico
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBuscarCNJ}
            disabled={loading}
            title="Buscar movimentações atualizadas no CNJ (gratuito via DataJud)"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            Buscar no CNJ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {eventos.slice(0, 5).map((evt, i) => <HistoricoTimelineItem key={i} evento={evt} />)}
      </CardContent>
    </Card>
  );
}