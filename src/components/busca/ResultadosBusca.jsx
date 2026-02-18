import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProcessoEncontradoCard from './ProcessoEncontradoCard';
import { Badge } from '@/components/ui/badge';

export default function ResultadosBusca({ resultados }) {
  if (!resultados?.data) return null;

  const items = resultados.data.items || [resultados.data];
  const creditos = resultados.creditos_utilizados;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resultados ({items.length})</CardTitle>
          {creditos > 0 && <Badge variant="outline">{creditos} créditos</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((proc, i) => (
          <ProcessoEncontradoCard key={i} processo={proc} />
        ))}
      </CardContent>
    </Card>
  );
}