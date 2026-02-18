import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['analytics-metrics', dateRange, user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const [processos, tickets, agendamentos] = await Promise.all([
        base44.entities.Processo.filter({ created_by: user.email }, '-created_date', 100),
        base44.entities.Ticket.filter({ created_by: user.email }, '-created_date', 100),
        base44.entities.Appointment.filter({ created_by: user.email }, '-created_date', 100)
      ]);

      return {
        totalProcessos: processos?.length || 0,
        totalTickets: tickets?.length || 0,
        totalAgendamentos: agendamentos?.length || 0,
        ticketsResolvidos: tickets?.filter(t => t.status === 'closed').length || 0,
        taxaResolucao: tickets?.length > 0 ? Math.round((tickets.filter(t => t.status === 'closed').length / tickets.length) * 100) : 0
      };
    },
    enabled: !!user?.email
  });

  if (loadingUser) return <ResumeLoader />;
  if (!user) return null;
  if (loadingMetrics) return <AnalyticsSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Analytics
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Métricas e relatórios do seu escritório
            </p>
          </div>
          <Button className="bg-[var(--brand-primary)]">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2">
          {['7days', '30days', '90days', 'lifetime'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {range === '7days' && '7 dias'}
              {range === '30days' && '30 dias'}
              {range === '90days' && '90 dias'}
              {range === 'lifetime' && 'Todos'}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Processos"
            value={metrics?.totalProcessos || 0}
            icon={BarChart3}
            trend="+12%"
          />
          <MetricCard
            title="Tickets"
            value={metrics?.totalTickets || 0}
            icon={TrendingUp}
            trend="+8%"
          />
          <MetricCard
            title="Consultas"
            value={metrics?.totalAgendamentos || 0}
            icon={Calendar}
            trend="+5%"
          />
          <MetricCard
            title="Taxa de Resolução"
            value={`${metrics?.taxaResolucao || 0}%`}
            icon={TrendingUp}
            trend="+3%"
          />
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">
                Gráfico de distribuição (Recharts)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-[var(--text-secondary)]">
                Gráfico de evolução (Recharts)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-primary)]">
                    <th className="text-left py-2 px-2">Métrica</th>
                    <th className="text-right py-2 px-2">Valor</th>
                    <th className="text-right py-2 px-2">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]">
                    <td className="py-3 px-2">Total de Processos</td>
                    <td className="text-right py-3 px-2">{metrics?.totalProcessos || 0}</td>
                    <td className="text-right py-3 px-2 text-green-600">+12%</td>
                  </tr>
                  <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]">
                    <td className="py-3 px-2">Tickets Resolvidos</td>
                    <td className="text-right py-3 px-2">{metrics?.ticketsResolvidos || 0}</td>
                    <td className="text-right py-3 px-2 text-green-600">+8%</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-primary)]">
                    <td className="py-3 px-2">Taxa de Resolução</td>
                    <td className="text-right py-3 px-2">{metrics?.taxaResolucao || 0}%</td>
                    <td className="text-right py-3 px-2 text-green-600">+3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-sm">{title}</p>
            <div className="text-3xl font-bold text-[var(--text-primary)] mt-2">
              {value}
            </div>
            <p className="text-green-600 text-xs mt-2">{trend} este mês</p>
          </div>
          <Icon className="w-8 h-8 text-[var(--brand-primary)] opacity-50" />
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 bg-[var(--bg-primary)] rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}