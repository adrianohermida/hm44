import React from 'react';
import { FixedSizeList } from 'react-window';
import MovimentacaoTimelineItem from './MovimentacaoTimelineItem';

export default function ProcessoMovimentacoesVirtualized({ movimentacoes, height = 600 }) {
  const Row = ({ index, style }) => (
    <div style={style} className="px-4">
      <MovimentacaoTimelineItem movimentacao={movimentacoes[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={height}
      itemCount={movimentacoes.length}
      itemSize={120}
      width="100%"
      className="scrollbar-thin"
    >
      {Row}
    </FixedSizeList>
  );
}