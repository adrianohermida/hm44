import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useProcessoEscavador(processoId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sincronizarProcesso = async (numeroProcesso) => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('sincronizarProcessoEscavador', {
        numero_processo: numeroProcesso
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarProcesso = async (termo, tipo = 'BUSCA_PROCESSO', tribunal = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await base44.functions.invoke('buscarProcessoEscavador', {
        termo,
        tipo_pesquisa: tipo,
        tribunal_sigla: tribunal
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sincronizarProcesso,
    buscarProcesso
  };
}