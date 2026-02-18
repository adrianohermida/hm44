import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function SituacaoProcessoBadge({ situacao }) {
  const getBadgeColor = (nome) => {
    if (/arquivado/i.test(nome)) return 'bg-gray-500 text-white';
    if (/sentença|julgado/i.test(nome)) return 'bg-green-600 text-white';
    if (/suspenso|sobrestado/i.test(nome)) return 'bg-yellow-600 text-white';
    return 'bg-blue-600 text-white';
  };

  return (
    <Badge className={getBadgeColor(situacao.nome)}>
      {situacao.nome}
    </Badge>
  );
}