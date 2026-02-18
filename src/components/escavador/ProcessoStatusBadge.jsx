import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Archive, Eye, EyeOff } from 'lucide-react';

export default function ProcessoStatusBadge({ processo }) {
  return (
    <div className="flex flex-wrap gap-2">
      {processo.arquivado && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Archive className="w-3 h-3" />
          Arquivado
        </Badge>
      )}
      {processo.segredo_justica && (
        <Badge className="bg-[var(--brand-error)] flex items-center gap-1">
          <EyeOff className="w-3 h-3" />
          Segredo de Justiça
        </Badge>
      )}
      {processo.fisico && (
        <Badge variant="outline" className="flex items-center gap-1">
          Físico
        </Badge>
      )}
      {processo.monitoramento_ativo && (
        <Badge className="bg-[var(--brand-info)] flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Monitorado
        </Badge>
      )}
    </div>
  );
}