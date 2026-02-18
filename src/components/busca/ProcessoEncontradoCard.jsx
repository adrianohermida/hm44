import React from 'react';
import { Badge } from '@/components/ui/badge';
import ImportarProcessoButton from './ImportarProcessoButton';

export default function ProcessoEncontradoCard({ processo }) {
  return (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-bold">{processo.numero_cnj}</p>
          <p className="text-sm text-[var(--text-secondary)]">{processo.titulo_polo_ativo} vs {processo.titulo_polo_passivo}</p>
        </div>
        <ImportarProcessoButton processo={processo} />
      </div>

      <div className="flex gap-2">
        <Badge variant="outline">{processo.ano_inicio}</Badge>
        <Badge variant="outline">{processo.quantidade_movimentacoes} mov.</Badge>
        {processo.estado_origem && <Badge variant="outline">{processo.estado_origem.sigla}</Badge>}
      </div>
    </div>
  );
}