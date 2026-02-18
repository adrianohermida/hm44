import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ProcessoStatus({ status }) {
  const statusConfig = {
    ativo: { label: 'Ativo', className: 'bg-[var(--brand-success)]' },
    arquivado: { label: 'Arquivado', className: 'bg-[var(--text-tertiary)]' },
    suspenso: { label: 'Suspenso', className: 'bg-[var(--brand-warning)]' },
    baixado: { label: 'Baixado', className: 'bg-[var(--text-secondary)]' }
  };

  const config = statusConfig[status] || statusConfig.ativo;

  return <Badge className={`${config.className} text-white`}>{config.label}</Badge>;
}