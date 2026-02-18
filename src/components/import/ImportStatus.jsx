import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ImportStatus({ status }) {
  const colors = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    PROCESSANDO: 'bg-blue-100 text-blue-800',
    CONCLUIDO: 'bg-green-100 text-green-800',
    ERRO: 'bg-red-100 text-red-800',
    PAUSADO: 'bg-gray-100 text-gray-800'
  };

  return (
    <Badge className={colors[status] || ''}>
      {status}
    </Badge>
  );
}