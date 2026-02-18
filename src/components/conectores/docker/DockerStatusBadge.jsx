import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function DockerStatusBadge({ status }) {
  const config = {
    PENDENTE: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
    PROCESSANDO: { label: 'Processando', className: 'bg-blue-100 text-blue-800' },
    CONCLUIDO: { label: 'Concluído', className: 'bg-green-100 text-green-800' },
    ERRO: { label: 'Erro', className: 'bg-red-100 text-red-800' }
  };

  const { label, className } = config[status] || config.PENDENTE;

  return <Badge className={className}>{label}</Badge>;
}