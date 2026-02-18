import React from 'react';
import moment from 'moment';

export default function HealthMetrics({ provedor }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-[var(--text-tertiary)]">Latência Média</p>
        <p className="font-semibold text-[var(--text-primary)]">
          {provedor.latencia_media_ms || 0}ms
        </p>
      </div>
      <div>
        <p className="text-[var(--text-tertiary)]">Taxa de Sucesso</p>
        <p className="font-semibold text-[var(--text-primary)]">
          {provedor.taxa_sucesso || 100}%
        </p>
      </div>
      <div>
        <p className="text-[var(--text-tertiary)]">Total Requisições</p>
        <p className="font-semibold text-[var(--text-primary)]">
          {provedor.total_requisicoes || 0}
        </p>
      </div>
      <div>
        <p className="text-[var(--text-tertiary)]">Última Verificação</p>
        <p className="font-semibold text-[var(--text-primary)]">
          {provedor.ultima_verificacao ? moment(provedor.ultima_verificacao).fromNow() : 'Nunca'}
        </p>
      </div>
    </div>
  );
}