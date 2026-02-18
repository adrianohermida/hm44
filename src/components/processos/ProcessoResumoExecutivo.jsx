import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProcessoResumoExecutivo({ processoId, modoCliente = false }) {
  const { data: stats } = useQuery({
    queryKey: ['processo-stats', processoId],
    queryFn: async () => {
      const [tarefas, publicacoes, movimentacoes] = await Promise.all([
        base44.entities.TarefaProcesso.filter({ processo_id: processoId, status: 'pendente' }),
        base44.entities.PublicacaoProcesso.filter({ processo_id: processoId, lida: false }),
        base44.entities.MovimentacaoProcesso.filter({ processo_id: processoId })
      ]);
      return { tarefasPendentes: tarefas.length, publicacoesNaoLidas: publicacoes.length, totalMovimentacoes: movimentacoes.length };
    },
    enabled: !!processoId,
    refetchInterval: 30000
  });

  if (!stats) return null;

  const labels = modoCliente ? {
    titulo: 'Situação do Seu Processo',
    tarefas: 'Ações Necessárias',
    publicacoes: 'Novidades do Tribunal',
    movimentacoes: 'Atualizações'
  } : {
    titulo: 'Resumo Executivo',
    tarefas: 'Tarefas Pendentes',
    publicacoes: 'Publicações Não Lidas',
    movimentacoes: 'Movimentações'
  };

  return (
    <Card className="border-l-4 border-l-[var(--brand-primary)]" role="region" aria-label="Resumo executivo do processo">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />{labels.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{labels.tarefas}</span>
          <span 
            className={`text-sm font-bold ${stats.tarefasPendentes > 0 ? 'text-[var(--brand-warning)]' : 'text-[var(--brand-success)]'}`}
            aria-live="polite"
          >
            {stats.tarefasPendentes}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{labels.publicacoes}</span>
          <span 
            className={`text-sm font-bold ${stats.publicacoesNaoLidas > 0 ? 'text-[var(--brand-error)]' : 'text-[var(--brand-success)]'}`}
            aria-live="polite"
          >
            {stats.publicacoesNaoLidas}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{labels.movimentacoes}</span>
          <span className="text-sm font-bold text-[var(--text-primary)]">{stats.totalMovimentacoes}</span>
        </div>
      </CardContent>
    </Card>
  );
}