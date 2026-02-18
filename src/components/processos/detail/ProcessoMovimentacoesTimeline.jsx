import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import MovimentacaoTimelineItem from './MovimentacaoTimelineItem';
import ProcessoMovimentacoesVirtualized from './ProcessoMovimentacoesVirtualized';
import MovimentacaoDetailModal from './MovimentacaoDetailModal';

export default function ProcessoMovimentacoesTimeline({ movimentacoes }) {
  const [detailMov, setDetailMov] = useState(null);

  if (!movimentacoes?.length) return null;

  const useVirtualization = movimentacoes.length > 100;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />Movimentações ({movimentacoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {useVirtualization ? (
            <ProcessoMovimentacoesVirtualized movimentacoes={movimentacoes} onViewDetails={setDetailMov} />
          ) : (
            <div className="space-y-4">
              {movimentacoes.map((mov, i) => (
                <MovimentacaoTimelineItem key={i} movimentacao={mov} onViewDetails={setDetailMov} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <MovimentacaoDetailModal 
        movimentacao={detailMov} 
        open={!!detailMov} 
        onClose={() => setDetailMov(null)} 
      />
    </>
  );
}