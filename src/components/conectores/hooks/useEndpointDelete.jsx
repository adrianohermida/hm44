import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useEndpointDelete() {
  const queryClient = useQueryClient();

  const deletar = async (endpointId, onSuccess) => {
    if (!confirm('Deletar endpoint?')) return;
    
    try {
      await base44.entities.EndpointAPI.delete(endpointId);
      queryClient.invalidateQueries(['endpoints']);
      toast.success('Endpoint deletado');
      onSuccess?.();
    } catch {
      toast.error('Erro ao deletar');
    }
  };

  return { deletar };
}