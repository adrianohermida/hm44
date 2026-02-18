import React from 'react';
import CNJCopyButton from '@/components/common/CNJCopyButton';
import ProcessoStatusBadge from './ProcessoStatusBadge';

export default function ProcessoHeaderInfo({ processo }) {
  if (!processo) return null;
  
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <CNJCopyButton numeroCNJ={processo.numero_cnj} className="text-lg md:text-2xl font-bold h-auto py-1" />
        <ProcessoStatusBadge status={processo.status} />
      </div>
      {processo.titulo && (
        <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate mt-1">
          {processo.titulo}
        </p>
      )}
    </div>
  );
}