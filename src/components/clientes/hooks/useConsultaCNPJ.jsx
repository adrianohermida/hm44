import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function useConsultaCNPJ() {
  const [loading, setLoading] = useState(false);

  const consultar = async (cnpj) => {
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      toast.error('CNPJ inválido');
      return null;
    }

    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('consultarCNPJDirectData', { cnpj });
      toast.success('Dados carregados com sucesso!');
      return data;
    } catch (error) {
      toast.error('Erro ao consultar CNPJ: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { consultar, loading };
}