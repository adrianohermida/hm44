import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';

export default function LeadsReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: leads = [] } = useQuery({
    queryKey: ['leads-report', escritorioId],
    queryFn: () => base44.entities.Lead.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const quentes = leads.filter(l => l.temperatura === 'quente').length;
  const mornos = leads.filter(l => l.temperatura === 'morno').length;
  const frios = leads.filter(l => l.temperatura === 'frio').length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Total" value={leads.length} />
        <MetricCard label="Quentes" value={quentes} color="text-red-600" />
        <MetricCard label="Mornos" value={mornos} color="text-yellow-600" />
        <MetricCard label="Frios" value={frios} color="text-blue-600" />
      </div>
    </div>
  );
}