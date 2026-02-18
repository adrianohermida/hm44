import React from 'react';
import { Badge } from '@/components/ui/badge';
import EndpointHealthSummary from './EndpointHealthSummary';

export default function EndpointCardContent({ endpoint }) {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-[var(--text-primary)]">
          {endpoint.nome}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{endpoint.metodo}</Badge>
          <EndpointHealthSummary endpointId={endpoint.id} />
        </div>
      </div>
      <span className="text-xs text-[var(--text-tertiary)] block truncate">
        {endpoint.path}
      </span>
      {endpoint.creditos_consumidos > 0 && (
        <span className="text-xs text-[var(--text-secondary)] mt-1 block">
          {endpoint.creditos_consumidos} créditos
        </span>
      )}
    </>
  );
}