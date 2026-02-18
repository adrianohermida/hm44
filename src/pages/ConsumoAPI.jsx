import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ConsumoAPICard from '@/components/consumo/ConsumoAPICard';
import ConsumoAPIChart from '@/components/consumo/ConsumoAPIChart';
import HistoricoRequisicoes from '@/components/consumo/HistoricoRequisicoes';
import AlertaConsumoConfig from '@/components/consumo/AlertaConsumoConfig';

export default function ConsumoAPI() {
  const { data: config } = useQuery({
    queryKey: ['config-escavador'],
    queryFn: async () => {
      const configs = await base44.entities.ConfiguracaoEscavador.list();
      return configs[0];
    }
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico-api'],
    queryFn: () => base44.entities.HistoricoRequisicaoAPI.list('-created_date', 50)
  });

  const consumoMensal = historico
    .filter(h => new Date(h.created_date).getMonth() === new Date().getMonth())
    .reduce((sum, h) => sum + (h.creditos || 0), 0);

  const dadosChart = historico.slice(0, 30).map(h => ({
    dia: new Date(h.created_date).toLocaleDateString('pt-BR'),
    creditos: h.creditos || 0
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Consumo API' }]} />
      
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Dashboard de Consumo
      </h1>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <ConsumoAPICard 
          creditosUsados={consumoMensal}
          limiteCreditos={config?.limite_creditos_mensal || 1000}
        />
        <AlertaConsumoConfig config={config} />
      </div>

      <div className="mb-6">
        <ConsumoAPIChart dados={dadosChart} />
      </div>

      <HistoricoRequisicoes requisicoes={historico.slice(0, 10)} />
    </div>
  );
}