import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import RecomendacaoItem from './RecomendacaoItem';

export default function RecomendacoesPanel({ recomendacoes }) {
  if (!recomendacoes?.length) return null;

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Recomendações de Schema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recomendacoes.map((r, i) => (
          <RecomendacaoItem key={i} recomendacao={r} />
        ))}
      </CardContent>
    </Card>
  );
}