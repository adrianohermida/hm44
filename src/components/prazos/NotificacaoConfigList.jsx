import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import NotificacaoConfigItem from './NotificacaoConfigItem';

export default function NotificacaoConfigList({ configs }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ConfiguracaoNotificacaoPrazo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacoes-prazos']);
      toast.success('Configuração removida');
    },
    onError: () => toast.error('Erro ao remover')
  });

  if (!configs || configs.length === 0) return null;

  return (
    <>
      {configs.map(config => (
        <NotificacaoConfigItem
          key={config.id}
          config={config}
          onDelete={() => deleteMutation.mutate(config.id)}
        />
      ))}
    </>
  );
}