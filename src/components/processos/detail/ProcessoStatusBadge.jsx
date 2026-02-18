import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ProcessoStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || 'ativo';
  
  const statusMap = {
    ativo: { 
      label: 'Ativo', 
      className: 'bg-[var(--brand-success)] text-white hover:bg-[var(--brand-success)]'
    },
    suspenso: { 
      label: 'Suspenso', 
      className: 'bg-[var(--brand-warning)] text-white hover:bg-[var(--brand-warning)]'
    },
    arquivado: { 
      label: 'Arquivado', 
      className: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
    },
    baixado: {
      label: 'Baixado',
      className: 'bg-gray-500 text-white hover:bg-gray-600'
    }
  };
  
  const config = statusMap[normalizedStatus] || statusMap.ativo;

  return <Badge className={config.className}>{config.label}</Badge>;
}