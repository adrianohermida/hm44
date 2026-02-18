import React from 'react';

export default function JobProgressBar({ job }) {
  const isRunning = !['CONCLUIDO', 'ERRO'].includes(job.status);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{job.etapa_atual || 'Processando...'}</span>
        <span className="text-sm font-bold text-[var(--brand-primary)]">{job.progresso_percentual}%</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ${
            isRunning ? 'bg-gradient-to-r from-[var(--brand-primary)] to-blue-500' : 
            job.status === 'ERRO' ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ width: `${job.progresso_percentual}%` }}
        />
      </div>
    </div>
  );
}