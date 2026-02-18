import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';

export default function ComunicacaoReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: conversas = [] } = useQuery({
    queryKey: ['conversas-report', escritorioId],
    queryFn: () => base44.entities.Conversa.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const abertas = conversas.filter(c => c.status === 'aberta').length;
  const fechadas = conversas.filter(c => c.status === 'fechada').length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Comunicação</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total" value={conversas.length} />
        <MetricCard label="Abertas" value={abertas} />
        <MetricCard label="Fechadas" value={fechadas} />
      </div>
    </div>
  );
}