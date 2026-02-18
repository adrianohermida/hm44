import React from 'react';

export default function DockerProgressBar({ progresso, status }) {
  if (status !== 'PROCESSANDO') return null;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Analisando documento...</span>
        <span className="text-sm font-medium">{progresso}%</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2.5">
        <div 
          className="bg-[var(--brand-primary)] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
}