import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KeywordsRanking({ keywords }) {
  if (!keywords?.length) {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Ranking de Palavras-Chave</h3>
        <p className="text-gray-500 text-center py-8">Nenhuma palavra-chave rastreada</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Ranking de Palavras-Chave</h3>
      <div className="space-y-3">
        {keywords.map((kw, i) => {
          const TrendIcon = kw.tendencia === 'subindo' ? TrendingUp : 
                           kw.tendencia === 'descendo' ? TrendingDown : Minus;
          const trendColor = kw.tendencia === 'subindo' ? 'text-green-600' : 
                            kw.tendencia === 'descendo' ? 'text-red-600' : 'text-gray-400';
          
          return (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{kw.palavra}</p>
                <p className="text-xs text-gray-500">{kw.artigo_titulo}</p>
              </div>
              <div className="text-center">
                <Badge variant="outline">Posição {kw.posicao}</Badge>
              </div>
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              <div className="text-right min-w-[60px]">
                <p className="text-sm font-bold">{kw.volume || 0}</p>
                <p className="text-xs text-gray-500">buscas/mês</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}