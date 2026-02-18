import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

export default function ImportProgress({ progress }) {
  const percent = (progress.current / progress.total) * 100;
  const done = progress.current === progress.total;

  return (
    <div className="text-center space-y-4">
      {done ? (
        <>
          <CheckCircle className="w-16 h-16 mx-auto text-[var(--brand-success)]" />
          <p className="font-semibold">Importação concluída!</p>
          <p className="text-sm text-[var(--text-secondary)]">
            {progress.current} endpoints importados
          </p>
        </>
      ) : (
        <>
          <Progress value={percent} />
          <p className="text-sm text-[var(--text-secondary)]">
            {progress.current} de {progress.total} endpoints
          </p>
        </>
      )}
    </div>
  );
}