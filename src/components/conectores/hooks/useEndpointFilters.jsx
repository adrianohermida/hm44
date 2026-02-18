import { useState, useMemo } from 'react';

export default function useEndpointFilters(endpoints) {
  const [provedorFiltro, setProvedorFiltro] = useState('all');
  const [versaoFiltro, setVersaoFiltro] = useState('all');

  const filtrados = useMemo(() => {
    return endpoints.filter(e => {
      if (provedorFiltro !== 'all' && e.provedor_id !== provedorFiltro) return false;
      if (versaoFiltro !== 'all' && e.versao_api !== versaoFiltro) return false;
      return true;
    });
  }, [endpoints, provedorFiltro, versaoFiltro]);

  return {
    provedorFiltro,
    versaoFiltro,
    setProvedorFiltro,
    setVersaoFiltro,
    filtrados
  };
}