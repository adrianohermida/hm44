import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function AnalyticsDashboard({ escritorioId }) {
  if (!escritorioId) return null;

  // Simulated trending data (replace with real API in Phase 15)
  const { data: trendData = [] } = useQuery({
    queryKey: ['analytics-trend', escritorioId],
    queryFn: async () => {
      const last30days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
          tickets: Math.floor(Math.random() * 50) + 20,
          processos: Math.floor(Math.random() * 30) + 10,
          receita: Math.floor(Math.random() * 5000) + 2000,
        };
      });
      return last30days;
    },
  });

  const { data: conversionData = [] } = useQuery({
    queryKey: ['analytics-conversion', escritorioId],
    queryFn: async () => {
      return [
        { stage: 'Leads', value: 100 },
        { stage: 'Qualificados', value: 65 },
        { stage: 'Propostas', value: 45 },
        { stage: 'Ganhos', value: 28 },
      ];
    },
  });

  return (
    <div className="space-y-6">
      {/* KPI Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tendências (últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="var(--brand-primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="processos"
                stroke="var(--brand-warning)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--brand-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--brand-primary)]">65%</div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Lead to Qualified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--brand-primary)]">69%</div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Qualified to Proposal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--brand-primary)]">62%</div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Proposal to Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[var(--brand-primary)]">28%</div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Total Conversion</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}