import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';
import ProcessosChart from './ProcessosChart';

export default function ProcessosReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: processos = [] } = useQuery({
    queryKey: ['processos-report', escritorioId],
    queryFn: () => base44.entities.Processo.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const ativos = processos.filter(p => p.status === 'ativo').length;
  const arquivados = processos.filter(p => p.status === 'arquivado').length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Processos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total" value={processos.length} />
        <MetricCard label="Ativos" value={ativos} />
        <MetricCard label="Arquivados" value={arquivados} />
      </div>
      <ProcessosChart processos={processos} />
    </div>
  );
}