import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AutoClassifyButton({ ticketId, onClassified }) {
  const queryClient = useQueryClient();

  const classifyMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('autoTicketResponse', {
        ticket_id: ticketId,
        action: 'classify'
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', ticketId]);
      toast.success('Ticket classificado automaticamente', {
        description: data.justificativa
      });
      if (onClassified) onClassified(data);
    },
    onError: (error) => {
      toast.error('Erro ao classificar: ' + error.message);
    }
  });

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => classifyMutation.mutate()}
      disabled={classifyMutation.isPending}
      className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
    >
      {classifyMutation.isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Classificando...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Classificar com IA
        </>
      )}
    </Button>
  );
}