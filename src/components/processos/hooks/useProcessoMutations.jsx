import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useProcessoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => base44.entities.Processo.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['processo', id]);
      const previous = queryClient.getQueryData(['processo', id]);
      queryClient.setQueryData(['processo', id], old => ({ ...old, ...data }));
      return { previous, id };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['processo', context.id], context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processo']);
      toast.success('Processo atualizado');
    }
  });
}

export function useParteMutations() {
  const queryClient = useQueryClient();
  
  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProcessoParte.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(['processo-partes']);
      const previous = queryClient.getQueryData(['processo-partes']);
      queryClient.setQueryData(['processo-partes'], old => old?.map(p => p.id === id ? { ...p, ...data } : p));
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['processo-partes'], context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processo-partes']);
      toast.success('Parte atualizada');
    }
  });

  const remove = useMutation({
    mutationFn: (id) => base44.entities.ProcessoParte.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['processo-partes']);
      const previous = queryClient.getQueryData(['processo-partes']);
      queryClient.setQueryData(['processo-partes'], old => old?.filter(p => p.id !== id));
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['processo-partes'], context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processo-partes']);
      toast.success('Parte removida');
    }
  });

  return { update, remove };
}

export function useDocumentoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => base44.entities.DocumentoAnexado.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documentos']);
      toast.success('Documento removido');
    }
  });
}