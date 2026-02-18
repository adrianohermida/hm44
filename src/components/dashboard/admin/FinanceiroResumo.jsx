import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinanceiroResumo({ escritorioId }) {
  const { data: honorarios = [], isLoading } = useQuery({
    queryKey: ['honorarios-resumo', escritorioId],
    queryFn: () => base44.entities.Honorario.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const totalRecebido = honorarios.filter(h => h.status === 'pago').reduce((s, h) => s + (h.valor_pago || 0), 0);
  const totalPendente = honorarios.filter(h => h.status === 'pendente' || h.status === 'parcialmente_pago').reduce((s, h) => s + ((h.valor_total || 0) - (h.valor_pago || 0)), 0);

  // Agrupar por mês (últimos 6 meses)
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });
    const recebido = honorarios
      .filter(h => h.status === 'pago' && h.created_date?.startsWith(key))
      .reduce((s, h) => s + (h.valor_pago || 0), 0);
    meses.push({ name: label, recebido });
  }

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardHeader>
        <CardTitle className="text-base text-[var(--text-primary)]">Financeiro — Últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-[var(--text-secondary)]">Recebido</p>
                <p className="text-xl font-bold text-green-600">
                  R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-[var(--text-secondary)]">A Receber</p>
                <p className="text-xl font-bold text-red-600">
                  R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={meses} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} width={55} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Bar dataKey="recebido" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} name="Recebido" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}