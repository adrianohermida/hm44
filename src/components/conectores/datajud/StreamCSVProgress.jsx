import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StreamCSVProgress({ progress, stats, importing }) {
  if (!importing && stats.processados === 0) return null;

  const successRate = stats.total > 0 
    ? ((stats.sucesso / stats.total) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {importing && <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-primary)]" />}
        <span className="text-sm font-medium">
          {importing ? 'Importando...' : 'Concluído'} {progress}%
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Total</p>
          <p className="text-lg font-semibold">{stats.total}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Processados</p>
          <p className="text-lg font-semibold">{stats.processados}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Sucesso</p>
          <p className="text-lg font-semibold text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {stats.sucesso}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-tertiary)]">Falhas</p>
          <p className="text-lg font-semibold text-red-600 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {stats.falhas}
          </p>
        </div>
      </div>

      {!importing && stats.total > 0 && (
        <p className="text-sm text-[var(--text-secondary)] text-center">
          Taxa de sucesso: {successRate}%
        </p>
      )}
    </div>
  );
}