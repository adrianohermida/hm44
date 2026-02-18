import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import { STALE_TIMES } from '@/components/utils/queryConfig';

export default function useProvedorOperations() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();
  const { data: escritorio } = useEscritorio();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (!escritorio?.id) {
        throw new Error('Escritório não encontrado');
      }
      
      const escritorioId = escritorio.id;
      
      const payload = { 
        ...data, 
        escritorio_id: escritorioId,
        oauth_config: data.oauth_config || {},
        api_key_config: data.api_key_config || {}
      };
      
      if (data.id) {
        return base44.entities.ProvedorAPI.update(data.id, payload);
      }
      return base44.entities.ProvedorAPI.create(payload);
    },
    onMutate: async (newProvedor) => {
      await queryClient.cancelQueries(['provedores', escritorio?.id]);
      const prev = queryClient.getQueryData(['provedores', escritorio?.id]);
      
      queryClient.setQueryData(['provedores', escritorio?.id], (old = []) => 
        newProvedor.id 
          ? old.map(p => p.id === newProvedor.id ? { ...p, ...newProvedor } : p)
          : [...old, { ...newProvedor, id: 'temp-' + Date.now() }]
      );
      
      return { prev };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['provedores']);
      toast.success('✅ Provedor salvo');
      closeForm();
    },
    onError: (error, vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['provedores', escritorio?.id], context.prev);
      }
      console.error('Erro ao salvar provedor:', error);
      toast.error('Erro: ' + (error.message || 'Falha ao salvar'));
    }
  });

  const openForm = (provedor = null) => {
    setEditing(provedor);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  return {
    showForm,
    editing,
    openForm,
    closeForm,
    save: saveMutation.mutate,
    isSaving: saveMutation.isPending
  };
}