import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_LABELS = {
  novo: 'Novo',
  contatado: 'Contatado',
  qualificado: 'Qualificado',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#22c55e', '#ef4444'];

export default function LeadsFunil({ escritorioId }) {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads-funil', escritorioId],
    queryFn: () => base44.entities.Lead.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId,
  });

  const grouped = Object.entries(STATUS_LABELS).map(([key, name], i) => ({
    name,
    value: leads.filter(l => l.status === key).length,
    color: COLORS[i],
  })).filter(g => g.value > 0);

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardHeader>
        <CardTitle className="text-base text-[var(--text-primary)]">
          Leads por Status ({leads.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : grouped.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">Nenhum lead cadastrado</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={grouped}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {grouped.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend iconSize={10} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}