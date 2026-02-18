import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ProcessosChart() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-chart', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Processo.filter({
      escritorio_id: escritorio[0].id,
    }),
    enabled: !!escritorio?.length,
  });

  const processarDados = () => {
    const meses = {};
    processos.forEach(p => {
      if (p.created_date) {
        const mes = new Date(p.created_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (!meses[mes]) {
          meses[mes] = { mes, total: 0, ativos: 0 };
        }
        meses[mes].total += 1;
        if (p.status === 'ativo') {
          meses[mes].ativos += 1;
        }
      }
    });
    return Object.values(meses).slice(-6);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const dados = processarDados();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
          Processos - Últimos 6 Meses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" strokeWidth={2} />
            <Line type="monotone" dataKey="ativos" stroke="#10b981" name="Ativos" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}