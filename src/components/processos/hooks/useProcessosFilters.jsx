import { useMemo } from 'react';

export function useProcessosFilters(processos, clientes, busca, filtros, publicacoes = []) {
  // Criar map de clientes para lookup O(1) ao invés de O(n)
  const clientesMap = useMemo(() => {
    const map = new Map();
    (clientes || []).forEach(c => map.set(c.id, c));
    return map;
  }, [clientes]);

  // Map de última publicação por processo
  const ultimaPublicacaoMap = useMemo(() => {
    const map = new Map();
    (publicacoes || []).forEach(pub => {
      const existing = map.get(pub.processo_id);
      if (!existing || new Date(pub.data) > new Date(existing.data)) {
        map.set(pub.processo_id, pub);
      }
    });
    return map;
  }, [publicacoes]);

  const hoje = useMemo(() => new Date(), []);

  return useMemo(() => {
    if (!processos?.length) return [];
    
    const buscaLower = busca?.toLowerCase().trim();
    
    return processos.filter(p => {
      // Status filter
      if (filtros.status !== 'todos') {
        if (filtros.status === 'favoritos' && !p.favorito) return false;
        if (filtros.status !== 'favoritos' && p.status !== filtros.status) return false;
      }
      
      // Cliente filter
      if (filtros.cliente_id !== 'todos' && p.cliente_id !== filtros.cliente_id) return false;
      
      // Publicação filter
      if (filtros.publicacao && filtros.publicacao !== 'todos') {
        const ultimaPub = ultimaPublicacaoMap.get(p.id);
        if (!ultimaPub) return false;

        const dataPub = new Date(ultimaPub.data);
        const diffDias = Math.floor((hoje - dataPub) / (1000 * 60 * 60 * 24));

        if (filtros.publicacao === 'ultimas_7d' && diffDias > 7) return false;
        if (filtros.publicacao === 'ultimos_15d' && diffDias > 15) return false;
        if (filtros.publicacao === 'ultimos_30d' && diffDias > 30) return false;
      }
      
      // Busca filter
      if (buscaLower) {
        const cliente = clientesMap.get(p.cliente_id);
        const clienteNome = cliente?.nome_completo?.toLowerCase() || '';
        
        if (!p.numero_cnj?.includes(busca) && !clienteNome.includes(buscaLower)) {
          return false;
        }
      }
      
      return true;
    });
  }, [processos, clientesMap, ultimaPublicacaoMap, busca, filtros]);
}