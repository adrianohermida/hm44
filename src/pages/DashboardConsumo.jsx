import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ConsumoGlobalCard from '@/components/dashboard-consumo/ConsumoGlobalCard';
import ConsumoUsuariosTable from '@/components/dashboard-consumo/ConsumoUsuariosTable';
import ConsumoOperacoesChart from '@/components/dashboard-consumo/ConsumoOperacoesChart';
import FaturasRecentesCard from '@/components/dashboard-consumo/FaturasRecentesCard';

export default function DashboardConsumo() {
  const { data: consumos = [] } = useQuery({
    queryKey: ['consumo-global'],
    queryFn: () => base44.entities.ConsumoAPIEscavador.list()
  });

  const { data: faturas = [] } = useQuery({
    queryKey: ['faturas-recentes'],
    queryFn: () => base44.entities.FaturaServico.list('-created_date', 10)
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Dashboard de Consumo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConsumoGlobalCard consumos={consumos} />
          <FaturasRecentesCard faturas={faturas} />
        </div>

        <ConsumoOperacoesChart consumos={consumos} />
        
        <ConsumoUsuariosTable consumos={consumos} />
      </div>
    </div>
  );
}