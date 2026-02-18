import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import NotificacaoConfigFields from './NotificacaoConfigFields';

export default function NotificacaoConfigForm({ escritorioId, onSuccess, onCancel }) {
  const [dias, setDias] = useState(3);
  const [tipo, setTipo] = useState('todos');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ConfiguracaoNotificacaoPrazo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notificacoes-prazos']);
      toast.success('Configuração criada');
      onSuccess();
    },
    onError: () => toast.error('Erro ao criar configuração')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      escritorio_id: escritorioId,
      tipo_prazo: tipo,
      dias_antecedencia: parseInt(dias)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3">
      <NotificacaoConfigFields
        tipo={tipo}
        setTipo={setTipo}
        dias={dias}
        setDias={setDias}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Criar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}