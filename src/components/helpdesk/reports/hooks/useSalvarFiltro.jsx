import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useSalvarFiltro(filtros, onClose) {
  const [nome, setNome] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const salvarMutation = useMutation({
    mutationFn: () => base44.entities.FiltroSalvo.create({
      user_email: user.email,
      nome,
      filtros,
      tipo: 'relatorio',
      favorito: false,
      ordem: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos']);
      toast.success('Filtro salvo com sucesso');
      onClose();
      setNome('');
    },
    onError: () => toast.error('Erro ao salvar filtro')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Digite um nome para o filtro');
      return;
    }
    salvarMutation.mutate();
  };

  return { nome, setNome, handleSubmit, isPending: salvarMutation.isPending };
}