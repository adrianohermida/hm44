import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useAlertas() {
  const [form, setForm] = useState({
    email_destinatarios: [],
    webhook_url: '',
    ativar_email: true,
    ativar_webhook: false,
    alertar_breaking_changes: true,
    alertar_erros_criticos: true
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: () => base44.entities.Escritorio.list().then(r => r[0]),
    enabled: !!user
  });

  const { data: config } = useQuery({
    queryKey: ['alertas-config', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return null;
      return await base44.entities.ConfiguracaoAlerta.filter({ escritorio_id: escritorio.id }).then(r => r[0]);
    },
    enabled: !!escritorio?.id
  });

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, escritorio_id: escritorio.id };
      if (config) {
        return base44.entities.ConfiguracaoAlerta.update(config.id, payload);
      }
      return base44.entities.ConfiguracaoAlerta.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas-config']);
      toast.success('Configuração salva');
    }
  });

  return {
    form,
    setForm,
    save: () => saveMutation.mutate(form),
    isSaving: saveMutation.isPending
  };
}