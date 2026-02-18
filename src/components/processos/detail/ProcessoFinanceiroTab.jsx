import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function ProcessoFinanceiroTab({ processoId }) {
  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios-processo', processoId],
    queryFn: () => base44.entities.Honorario.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const totalHonorarios = honorarios.reduce((acc, h) => acc + (h.valor_total || 0), 0);
  const totalPago = honorarios.reduce((acc, h) => acc + (h.valor_pago || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Honorários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {totalHonorarios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--brand-success)]">
              {totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Saldo Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--brand-warning)]">
              {(totalHonorarios - totalPago).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {honorarios.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-center py-8">Nenhum honorário registrado</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Honorários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {honorarios.map((h) => (
              <div key={h.id} className="flex justify-between items-center p-3 border border-[var(--border-primary)] rounded-lg">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{h.descricao || 'Honorário'}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {new Date(h.created_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {h.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Pago: {(h.valor_pago || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}