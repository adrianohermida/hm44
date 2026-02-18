import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import PrazoFeedbackForm from './PrazoFeedbackForm';

export default function PrazoFeedbackPanel({ prazo, publicacao }) {
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: async ({ aceito, dias_ajustado, tipo_prazo_ajustado }) => {
      return await base44.entities.AprendizadoCalculoPrazo.create({
        escritorio_id: prazo.escritorio_id,
        publicacao_id: publicacao.id,
        sugestao_automatica: {
          tipo_prazo: prazo.tipo_prazo,
          dias: prazo.dias_prazo,
          confianca: prazo.confianca_ia
        },
        confirmacao_usuario: {
          aceito,
          tipo_prazo_final: tipo_prazo_ajustado || prazo.tipo_prazo,
          dias_final: dias_ajustado || prazo.dias_prazo,
          ajustou: !aceito
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['aprendizado-prazos']);
      toast.success('Feedback registrado. Obrigado!');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao registrar feedback');
    }
  });

  if (prazo.origem_calculo !== 'ia') return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <PrazoFeedbackForm
          onSubmit={feedbackMutation.mutate}
          loading={feedbackMutation.isPending}
        />
      </CardContent>
    </Card>
  );
}