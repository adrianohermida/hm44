import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MetricCard from './MetricCard';

export default function FinanceiroReport() {
  const { data: escritorioList = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });
  const escritorioId = escritorioList[0]?.id;

  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios-report', escritorioId],
    queryFn: () => base44.entities.Honorario.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const total = honorarios.reduce((sum, h) => sum + (h.valor_total || 0), 0);
  const recebido = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);
  const pendente = total - recebido;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">Relatório Financeiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Valor Total" value={`R$ ${total.toFixed(2)}`} />
        <MetricCard label="Recebido" value={`R$ ${recebido.toFixed(2)}`} color="text-green-600" />
        <MetricCard label="Pendente" value={`R$ ${pendente.toFixed(2)}`} color="text-yellow-600" />
      </div>
    </div>
  );
}