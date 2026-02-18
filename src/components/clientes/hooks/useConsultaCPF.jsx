import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useConsultaCPF() {
  const [loading, setLoading] = useState(false);

  const consultar = async (cpf) => {
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return null;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('consultarCPFDirectData', { cpf });
      toast.success('Dados carregados com sucesso!');
      return data;
    } catch (error) {
      toast.error('Erro ao consultar CPF: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { consultar, loading };
}