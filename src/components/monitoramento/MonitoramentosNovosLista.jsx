import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MonitoramentosNovosLista() {
  const { data: monitoramentos = [] } = useQuery({
    queryKey: ['monitoramentos-novos'],
    queryFn: () => base44.entities.MonitoramentoNovosProcessos.filter({ ativo: true })
  });

  return (
    <div className="space-y-3">
      {monitoramentos.map(m => (
        <Card key={m.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{m.termo}</p>
              <Badge variant="outline">{m.tipo}</Badge>
            </div>
            {m.variacoes && (
              <p className="text-xs text-[var(--text-secondary)]">
                Variações: {m.variacoes.join(', ')}
              </p>
            )}
            {m.quantidade_resultados > 0 && (
              <Badge className="mt-2">{m.quantidade_resultados} processos encontrados</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}