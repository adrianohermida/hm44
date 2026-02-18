import React from 'react';

export default function JobProgressStats({ job }) {
  const hasRetries = job.opcoes?.retries_executados > 0;
  
  return (
    <div className={`grid ${hasRetries ? 'grid-cols-4' : 'grid-cols-3'} gap-4 text-sm`}>
      <div>
        <p className="text-[var(--text-tertiary)]">Processados</p>
        <p className="font-semibold text-[var(--text-primary)]">
          {job.registros_processados} / {job.total_registros}
        </p>
      </div>
      <div>
        <p className="text-[var(--text-tertiary)]">Sucesso</p>
        <p className="font-semibold text-green-600">{job.registros_sucesso}</p>
      </div>
      <div>
        <p className="text-[var(--text-tertiary)]">Falhas</p>
        <p className="font-semibold text-red-600">{job.registros_falha}</p>
      </div>
      {hasRetries && (
        <div>
          <p className="text-[var(--text-tertiary)]">Retries</p>
          <p className="font-semibold text-orange-600">{job.opcoes.retries_executados}</p>
        </div>
      )}
    </div>
  );
}