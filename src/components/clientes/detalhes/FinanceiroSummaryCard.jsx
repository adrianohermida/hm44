import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function FinanceiroSummaryCard({ clienteId, escritorioId }) {
  const { data: honorarios = [], isLoading } = useQuery({
    queryKey: ['honorarios-financeiro', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Honorario.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      });
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-[var(--bg-elevated)]">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (honorarios.length === 0) return null;

  const totalPago = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);
  const totalPendente = honorarios.reduce((sum, h) => sum + (h.valor_pendente || 0), 0);

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          FINANCEIRO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--text-tertiary)]">Total Pago</span>
          <span className="font-semibold text-sm text-green-600">
            R$ {totalPago.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--text-tertiary)]">Pendente</span>
          <span className="font-semibold text-sm text-orange-600">
            R$ {totalPendente.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}