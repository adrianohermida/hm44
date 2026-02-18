import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProcessoFinanceiroCard({ processoId }) {
  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios', processoId],
    queryFn: () => base44.entities.Honorario?.filter({ processo_id: processoId }) || [],
    enabled: !!processoId
  });

  const total = honorarios.reduce((sum, h) => sum + (h.valor_total || 0), 0);
  const pago = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-4 h-4" />Financeiro</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Total</span>
            <span className="font-semibold">R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Pago</span>
            <span className="font-semibold text-[var(--brand-success)]">R$ {pago.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Pendente</span>
            <span className="font-semibold text-[var(--brand-warning)]">R$ {(total - pago).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}