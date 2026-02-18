import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, subDays } from 'date-fns';

export default function RelatorioTendenciaChart({ escritorioId }) {
  const { data: eventos = [] } = useQuery({
    queryKey: ['relatorio-eventos', escritorioId],
    queryFn: () => base44.entities.RelatorioEvento.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = eventos.filter(e => e.created_date?.startsWith(dateStr)).length;
    return { date: format(date, 'dd/MM'), downloads: count };
  });

  if (eventos.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Tendência (últimos 30 dias)</CardTitle></CardHeader>
        <CardContent className="text-center py-8 text-[var(--text-secondary)]">
          Sem dados ainda. Exporte seu primeiro relatório!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Tendência (últimos 30 dias)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last30Days}>
            <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="downloads" stroke="var(--brand-primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}