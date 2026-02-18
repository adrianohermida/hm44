import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState, useEffect } from 'react';

export function useGatilhosAprovados() {
  const [selectedGatilho, setSelectedGatilho] = useState(null);

  const { data: gatilhos = [] } = useQuery({
    queryKey: ['gatilhos-aprovados'],
    queryFn: () => base44.entities.GatilhoMarketing.filter({ status: 'aprovado' }, '-score_potencial', 10),
  });

  useEffect(() => {
    if (gatilhos.length > 0 && !selectedGatilho) {
      const random = gatilhos[Math.floor(Math.random() * gatilhos.length)];
      setSelectedGatilho(random);
      trackImpressao(random.id);
    }
  }, [gatilhos]);

  const trackImpressao = async (id) => {
    const gatilho = gatilhos.find(g => g.id === id);
    if (gatilho) {
      await base44.entities.GatilhoMarketing.update(id, {
        metricas_ab: { ...gatilho.metricas_ab, impressoes: (gatilho.metricas_ab?.impressoes || 0) + 1 }
      });
    }
  };

  const trackClique = async (id) => {
    const gatilho = gatilhos.find(g => g.id === id);
    if (gatilho) {
      const metricas = gatilho.metricas_ab || {};
      const cliques = (metricas.cliques || 0) + 1;
      const impressoes = metricas.impressoes || 1;
      await base44.entities.GatilhoMarketing.update(id, {
        metricas_ab: { ...metricas, cliques, taxa_conversao: (cliques / impressoes) * 100 }
      });
    }
  };

  return { gatilhos, selectedGatilho, trackClique };
}