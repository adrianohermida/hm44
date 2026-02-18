import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { usePrazoMutation } from './hooks/usePrazoMutation';
import PrazoFormFields from './PrazoFormFields';
import PrazoFormActions from './PrazoFormActions';

export default function PrazoForm({ prazo, publicacao, processo, onSuccess, onCancel }) {
  const [form, setForm] = useState(prazo || {
    titulo: publicacao ? `Prazo: ${processo?.numero_cnj || ''}` : '',
    tipo: 'outro',
    data_vencimento: '',
    dias_prazo: 5,
    responsaveis: []
  });

  const { data: escritorio, isLoading } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const mutation = usePrazoMutation(prazo, onSuccess);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.data_vencimento) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    mutation.mutate({
      ...form,
      escritorio_id: escritorio.id,
      processo_id: processo?.id,
      publicacao_id: publicacao?.id,
      status: 'pendente'
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PrazoFormFields form={form} onChange={setForm} />
      <PrazoFormActions 
        loading={mutation.isPending} 
        isUpdate={!!prazo}
        onCancel={onCancel}
      />
    </form>
  );
}