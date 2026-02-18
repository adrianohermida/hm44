import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PrazosStatsCards from './PrazosStatsCards';
import PrazosAnalyticsSkeleton from './PrazosAnalyticsSkeleton';
import PrazosPorStatusChart from './PrazosPorStatusChart';
import PrazosPorTipoChart from './PrazosPorTipoChart';
import PrazosUrgentesWidget from './PrazosUrgentesWidget';

export default function PrazosAnalyticsDashboard() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: prazos = [], isLoading } = useQuery({
    queryKey: ['prazos-analytics'],
    queryFn: () => base44.entities.Prazo.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const stats = {
    total: prazos.length,
    pendentes: prazos.filter(p => p.status === 'pendente').length,
    cumpridos: prazos.filter(p => p.status === 'cumprido').length,
    urgentes: prazos.filter(p => {
      const dias = Math.ceil((new Date(p.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias < 3 && p.status !== 'cumprido';
    }).length
  };

  if (isLoading) return <PrazosAnalyticsSkeleton />;

  return (
    <div className="space-y-6">
      <PrazosStatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrazosPorStatusChart prazos={prazos} />
        <PrazosPorTipoChart prazos={prazos} />
      </div>
      <PrazosUrgentesWidget prazos={prazos} />
    </div>
  );
}