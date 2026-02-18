import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ClienteStatusBadge({ status }) {
  const config = {
    ativo: { label: 'Ativo', bg: 'bg-[var(--brand-success)]' },
    inativo: { label: 'Inativo', bg: 'bg-[var(--brand-text-tertiary)]' },
    potencial: { label: 'Potencial', bg: 'bg-[var(--brand-info)]' },
    arquivado: { label: 'Arquivado', bg: 'bg-[var(--brand-text-secondary)]' }
  };

  const { label, bg } = config[status] || config.ativo;

  return (
    <Badge className={`${bg} text-white text-xs`}>
      {label}
    </Badge>
  );
}