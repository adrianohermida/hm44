import React from 'react';
import { Progress } from '@/components/ui/progress';

const FASES = {
  'inicial': { label: 'Inicial', percentual: 10 },
  'citacao': { label: 'Citação', percentual: 20 },
  'contestacao': { label: 'Contestação', percentual: 35 },
  'instrucao': { label: 'Instrução', percentual: 60 },
  'sentenca': { label: 'Sentença', percentual: 85 },
  'recurso': { label: 'Recurso', percentual: 90 },
  'transito': { label: 'Trânsito em Julgado', percentual: 100 }
};

export default function ProcessoProgressBar({ fase = 'inicial' }) {
  const config = FASES[fase] || FASES.inicial;

  return (
    <div className="space-y-2" role="status" aria-label="Progresso processual">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-primary)]">Fase Processual</span>
        <span className="text-sm font-bold text-[var(--brand-primary)]" aria-live="polite">{config.label}</span>
      </div>
      <Progress value={config.percentual} className="h-2" aria-label={`${config.percentual}% concluído`} />
      <p className="text-xs text-[var(--text-secondary)] text-right" aria-hidden="true">{config.percentual}% concluído</p>
    </div>
  );
}