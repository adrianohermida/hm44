import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';

export default function ConsultasReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: consultas = [] } = useQuery({
    queryKey: ['consultas-report', escritorioId],
    queryFn: async () => {
      const all = await base44.entities.CalendarAvailability.filter({ escritorio_id: escritorioId });
      return all.filter(c => c.cliente_email);
    },
    enabled: !!escritorioId,
  });

  const confirmadas = consultas.filter(c => c.status === 'confirmada' || c.status === 'disponivel').length;
  const futuras = consultas.filter(c => new Date(c.data_hora) > new Date()).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório de Consultas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Agendadas" value={consultas.length} />
        <MetricCard label="Confirmadas" value={confirmadas} />
        <MetricCard label="Futuras" value={futuras} />
      </div>
    </div>
  );
}