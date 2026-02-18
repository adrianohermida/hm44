import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import SugestaoPrazoCard from './SugestaoPrazoCard';
import SugestaoPrazoActions from './SugestaoPrazoActions';

export default function SugestorPrazoIA({ publicacao, processo, escritorio, onSuccess }) {
  const queryClient = useQueryClient();

  const sugerirMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('sugerirPrazoIA', {
        publicacao_id: publicacao.id,
        escritorio_id: escritorio.id
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao analisar publicação');
    }
  });

  const aceitarMutation = useMutation({
    mutationFn: async (sugestao) => {
      const prazo = await base44.entities.Prazo.create({
        escritorio_id: escritorio.id,
        processo_id: processo?.id,
        publicacao_id: publicacao.id,
        titulo: `${sugestao.tipo_prazo} - ${processo?.numero_cnj || ''}`,
        tipo_prazo: sugestao.tipo_prazo,
        data_vencimento: sugestao.data_vencimento,
        dias_prazo: sugestao.dias,
        status: 'pendente',
        origem_calculo: 'ia',
        confianca_ia: sugestao.confianca
      });

      await base44.entities.PublicacaoProcesso.update(publicacao.id, {
        prazo_calculado: true,
        prazo_id: prazo.id
      });

      return prazo;
    },
    onSuccess: (prazo) => {
      queryClient.invalidateQueries(['prazos']);
      queryClient.invalidateQueries(['publicacoes-pendentes']);
      toast.success('Prazo criado com sucesso');
      onSuccess?.(prazo);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar prazo');
    }
  });

  if (sugerirMutation.isError) {
    return null;
  }

  if (!sugerirMutation.data && !sugerirMutation.isPending) {
    return (
      <Button onClick={() => sugerirMutation.mutate()} variant="outline" size="sm">
        <Brain className="w-4 h-4 mr-2" />
        Sugerir com IA
      </Button>
    );
  }

  if (sugerirMutation.isPending) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />
          <span className="text-sm text-[var(--text-secondary)]">Analisando publicação...</span>
        </CardContent>
      </Card>
    );
  }

  const sugestao = sugerirMutation.data?.sugestao;

  if (!sugestao) return null;

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardContent className="p-4 space-y-3">
        <SugestaoPrazoCard sugestao={sugestao} />
        <SugestaoPrazoActions
          onAceitar={() => aceitarMutation.mutate(sugestao)}
          onRejeitar={() => sugerirMutation.reset()}
          loading={aceitarMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}