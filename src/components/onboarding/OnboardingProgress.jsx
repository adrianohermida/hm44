import React from 'react';
import { Progress } from '@/components/ui/progress';

export default function OnboardingProgress({ current, total }) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[var(--text-secondary)]">Progresso</span>
        <span className="font-medium text-[var(--text-primary)]">{current} de {total}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}