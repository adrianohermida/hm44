import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProcessoConsumoAPICard({ numeroCnj }) {
  const { data: logs = [] } = useQuery({
    queryKey: ['consumo-api', numeroCnj],
    queryFn: () => base44.entities.ConsumoAPIExterna.filter({ 
      parametros: { numero_cnj: numeroCnj } 
    }),
    enabled: !!numeroCnj
  });

  const total = logs.length;
  const sucesso = logs.filter(l => l.sucesso).length;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4" />Consumo API</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Total de Consultas</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Taxa de Sucesso</span>
            <span className="font-semibold text-[var(--brand-success)]">
              {total > 0 ? Math.round((sucesso/total)*100) : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}