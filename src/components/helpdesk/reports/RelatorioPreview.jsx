import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RelatorioMetricsGrid from './RelatorioMetricsGrid';
import { Loader2 } from 'lucide-react';

export default function RelatorioPreview({ filtros, escritorioId }) {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['relatorio-tickets', escritorioId, filtros],
    enabled: !!escritorioId,
    queryFn: async () => {
      let query = { escritorio_id: escritorioId };
      
      if (filtros.status && filtros.status !== 'todos') {
        query.status = filtros.status;
      }
      
      if (filtros.departamento_id && filtros.departamento_id !== 'todos') {
        query.departamento_id = filtros.departamento_id;
      }
      
      const all = await base44.entities.Ticket.filter(query, '-created_date', 500);
      
      if (filtros.dataInicio || filtros.dataFim) {
        return all.filter(t => {
          const created = new Date(t.created_date);
          if (filtros.dataInicio && created < new Date(filtros.dataInicio)) return false;
          if (filtros.dataFim && created > new Date(filtros.dataFim)) return false;
          return true;
        });
      }
      
      return all;
    },
    enabled: !!escritorioId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96 gap-2">
          <div className="text-4xl">📊</div>
          <p className="text-gray-600">Nenhum ticket encontrado com esses filtros</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview do Relatório</CardTitle>
        <p className="text-sm text-gray-600">{tickets.length} ticket(s) encontrado(s)</p>
      </CardHeader>
      <CardContent>
        <RelatorioMetricsGrid tickets={tickets} />
      </CardContent>
    </Card>
  );
}