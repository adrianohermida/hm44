import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HealthBadge from '../health/HealthBadge';

export default function EndpointHealthSummary({ endpointId }) {
  const { data: testes = [] } = useQuery({
    queryKey: ['ultimo-teste', endpointId],
    queryFn: () => base44.entities.TesteEndpoint.filter({ endpoint_id: endpointId }, '-created_date', 1),
    enabled: !!endpointId
  });

  const ultimoTeste = testes[0];
  if (!ultimoTeste) return null;

  return (
    <div className="flex items-center gap-2">
      <HealthBadge status={ultimoTeste.status} />
      <span className="text-xs text-[var(--text-tertiary)]">
        {ultimoTeste.tempo_resposta_ms}ms
      </span>
    </div>
  );
}