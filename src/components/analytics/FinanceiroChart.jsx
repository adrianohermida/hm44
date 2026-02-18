import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

export default function FinanceiroChart() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });

  const { data: honorarios = [], isLoading } = useQuery({
    queryKey: ['honorarios-chart', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Honorario.filter({
      escritorio_id: escritorio[0].id,
    }),
    enabled: !!escritorio?.length,
  });

  const processarDados = () => {
    const meses = {};
    honorarios.forEach(h => {
      if (h.created_date) {
        const mes = new Date(h.created_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (!meses[mes]) {
          meses[mes] = { mes, recebido: 0, pendente: 0 };
        }
        if (h.status === 'pago') {
          meses[mes].recebido += parseFloat(h.valor_total || 0);
        } else {
          meses[mes].pendente += parseFloat(h.valor_total || 0);
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
          <DollarSign className="w-5 h-5 text-[var(--brand-primary)]" />
          Receitas - Últimos 6 Meses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="recebido" fill="#10b981" name="Recebido" />
            <Bar dataKey="pendente" fill="#f59e0b" name="Pendente" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}