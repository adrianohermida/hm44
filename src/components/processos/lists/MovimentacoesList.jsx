import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MovimentacaoItem from '../items/MovimentacaoItem';

export default function MovimentacoesList({ movimentacoes }) {
  if (!movimentacoes || movimentacoes.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhuma movimentação registrada
      </div>
    );
  }

  return (
    <ScrollArea className="h-[50vh] pr-4">
      <div className="space-y-3">
        {movimentacoes.map((mov, idx) => (
          <MovimentacaoItem key={idx} movimentacao={mov} />
        ))}
      </div>
    </ScrollArea>
  );
}