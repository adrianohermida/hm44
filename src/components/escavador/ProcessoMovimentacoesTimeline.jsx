import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProcessoMovimentacaoItem from './ProcessoMovimentacaoItem';

export default function ProcessoMovimentacoesTimeline({ movimentacoes }) {
  if (!movimentacoes || movimentacoes.length === 0) return null;

  const sortedMovs = [...movimentacoes].sort((a, b) => 
    new Date(b.data) - new Date(a.data)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Movimentações ({movimentacoes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedMovs.map((mov, idx) => (
            <ProcessoMovimentacaoItem key={idx} movimentacao={mov} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}