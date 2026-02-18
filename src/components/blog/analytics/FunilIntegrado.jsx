import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import FunilVendasChart from './FunilVendasChart';
import ConversaoMetrics from './ConversaoMetrics';
import ROIEstimado from './ROIEstimado';
import GapsConversao from './GapsConversao';

export default React.memo(function FunilIntegrado({ escritorioId }) {
  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-funil', escritorioId],
    queryFn: () => base44.entities.Blog.filter({ escritorio_id: escritorioId, publicado: true }),
    enabled: !!escritorioId
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['leads-funil', escritorioId],
    queryFn: () => base44.entities.Lead.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const { data: consultas = [] } = useQuery({
    queryKey: ['consultas-funil', escritorioId],
    queryFn: () => base44.entities.Atendimento.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const visitantes = artigos.reduce((acc, art) => acc + (art.visualizacoes || 0), 0);
  const totalLeads = leads.length;
  const totalConsultas = consultas.filter(c => c.status === 'agendado' || c.status === 'realizado').length;
  const totalClientes = consultas.filter(c => c.resultado === 'contratado').length;

  const dadosFunil = [
    { name: 'Visitantes', value: visitantes },
    { name: 'Leads', value: totalLeads },
    { name: 'Consultas', value: totalConsultas },
    { name: 'Clientes', value: totalClientes }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <FunilVendasChart dados={dadosFunil} />
      <ConversaoMetrics 
        visitantes={visitantes}
        leads={totalLeads}
        consultas={totalConsultas}
        clientes={totalClientes}
      />
      <ROIEstimado visitasMensais={visitantes} />
      <GapsConversao dados={{ visitantes, leads: totalLeads, consultas: totalConsultas, clientes: totalClientes }} />
    </div>
  );
});