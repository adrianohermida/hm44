import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AutoDetectarClientesButton({ processoId, partes = [] }) {
  const queryClient = useQueryClient();

  const detectarMutation = useMutation({
    mutationFn: async () => {
      const partesJaMarcadas = partes.filter(p => p.e_cliente_escritorio).length;
      if (partesJaMarcadas > 0) {
        return { clientes_detectados: 0, mensagem: 'Clientes já marcados' };
      }
      
      const { data } = await base44.functions.invoke('autoMarcarClientesProcesso', {
        processo_id: processoId
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['partes', processoId]);
      queryClient.invalidateQueries(['processo-clientes', processoId]);
      
      if (data.clientes_detectados > 0) {
        toast.success(`${data.clientes_detectados} cliente(s) detectado(s)`);
      } else {
        toast.info(data.mensagem || 'Nenhum cliente novo para marcar');
      }
    },
    onError: (err) => toast.error(err.message)
  });

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={() => detectarMutation.mutate()}
      disabled={detectarMutation.isPending}
    >
      {detectarMutation.isPending ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4 mr-1" />
      )}
      Auto-detectar
    </Button>
  );
}