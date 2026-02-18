import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';

export default function PrazosReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos-report', escritorioId],
    queryFn: () => base44.entities.Prazo.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pendentes = prazos.filter(p => p.status === 'pendente').length;
  const vencidos = prazos.filter(p => {
    const d = new Date(p.data_vencimento);
    d.setHours(0, 0, 0, 0);
    return d < hoje && p.status !== 'cumprido';
  }).length;
  const cumpridos = prazos.filter(p => p.status === 'cumprido').length;
  const criticos = prazos.filter(p => {
    const d = new Date(p.data_vencimento);
    d.setHours(0, 0, 0, 0);
    const days = Math.floor((d - hoje) / 86400000);
    return days >= 0 && days <= 7 && p.status !== 'cumprido';
  }).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Prazos</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="Total" value={prazos.length} />
        <MetricCard label="Pendentes" value={pendentes} color="text-yellow-600" />
        <MetricCard label="Vencidos" value={vencidos} color="text-red-600" />
        <MetricCard label="Críticos (7d)" value={criticos} color="text-orange-600" />
      </div>
    </div>
  );
}