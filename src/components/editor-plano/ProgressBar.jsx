import React from 'react';
import { Progress } from '@/components/ui/progress';

export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-[var(--text-secondary)]">
          Etapa {current + 1} de {total}
        </span>
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}