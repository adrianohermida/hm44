import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Lock } from 'lucide-react';

export default function ProcessoStatusChange({ status, segredo, arquivado }) {
  return (
    <div className="flex flex-wrap gap-2">
      {status === 'FOUND' && (
        <Badge className="bg-[var(--brand-success)] flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Encontrado
        </Badge>
      )}
      {status === 'NOT_FOUND' && (
        <Badge className="bg-[var(--brand-error)] flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Não Encontrado
        </Badge>
      )}
      {segredo && (
        <Badge className="bg-[var(--brand-warning)]">
          <Lock className="w-3 h-3 mr-1" />
          Segredo
        </Badge>
      )}
    </div>
  );
}