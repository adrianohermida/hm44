import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ProcessoResumoIACard({ resumo, processoId }) {
  const queryClient = useQueryClient();

  const gerarResumoMutation = useMutation({
    mutationFn: async () => {
      const { data } = await base44.functions.invoke('solicitarResumoIA', {
        processo_id: processoId
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resumo-ia', processoId]);
      toast.success('Resumo gerado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao gerar resumo: ' + error.message);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />Resumo AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resumo ? (
          <p className="text-sm text-[var(--text-primary)]">{resumo.resumo}</p>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">Nenhum resumo gerado ainda</p>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          disabled={gerarResumoMutation.isPending}
          onClick={() => gerarResumoMutation.mutate()}
        >
          {gerarResumoMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {resumo ? 'Atualizar Resumo' : 'Gerar Resumo'}
        </Button>
      </CardContent>
    </Card>
  );
}