import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ThreadCardHeader({ thread }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <h4 className={`font-semibold truncate text-sm ${thread.naoLida ? 'text-gray-900' : 'text-gray-600'}`}>
        {thread.clienteNome || 'Cliente'}
      </h4>
      <span className="text-[10px] text-gray-400 flex-shrink-0">
        {formatDistanceToNow(new Date(thread.ultimaAtualizacao), { addSuffix: true, locale: ptBR })}
      </span>
    </div>
  );
}