import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ConversaoFunnel from './ConversaoFunnel';
import MetricCard from './MetricCard';

export default function ConversaoReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: leads = [] } = useQuery({
    queryKey: ['leads-conversao', escritorioId],
    queryFn: () => base44.entities.Lead.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const total = leads.length;
  const convertidos = leads.filter(l => l.status === 'ganho' || l.convertido_cliente_id).length;
  const taxa = total > 0 ? ((convertidos / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Conversões</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total de Leads" value={total} />
        <MetricCard label="Convertidos" value={convertidos} />
        <MetricCard label="Taxa de Conversão" value={`${taxa}%`} />
      </div>
      <ConversaoFunnel leads={leads} />
    </div>
  );
}