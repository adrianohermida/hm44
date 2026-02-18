import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function AudienciaItem({ audiencia }) {
  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-[var(--text-primary)]">{audiencia.tipo}</p>
        <Badge variant="outline" className="text-xs">
          {new Date(audiencia.data).toLocaleDateString()}
        </Badge>
      </div>
      {audiencia.situacao && (
        <p className="text-sm text-[var(--text-secondary)]">Situação: {audiencia.situacao}</p>
      )}
      {audiencia.local && (
        <p className="text-sm text-[var(--text-secondary)]">Local: {audiencia.local}</p>
      )}
    </div>
  );
}