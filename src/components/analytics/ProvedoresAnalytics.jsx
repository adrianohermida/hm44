import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoadingState from '@/components/common/LoadingState';
import LatencyTrendChart from './LatencyTrendChart';
import SuccessRateChart from './SuccessRateChart';
import AvailabilityHeatmap from './AvailabilityHeatmap';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function ProvedoresAnalytics({ provedores = [] }) {
  const { data: historico = [], isLoading } = useQuery({
    queryKey: ['historico-saude'],
    queryFn: async () => {
      const hist = await base44.entities.HistoricoSaudeProvedor.list('-created_date', 100);
      return hist;
    }
  });

  if (isLoading) return <LoadingState message="Carregando analytics..." />;

  const statusDistribution = provedores.reduce((acc, p) => {
    const status = p.saude_status || 'Desconhecido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Saudável', value: statusDistribution['Saudável'] || 0, color: '#10b981' },
    { name: 'Degradado', value: statusDistribution['Degradado'] || 0, color: '#f59e0b' },
    { name: 'Indisponível', value: statusDistribution['Indisponível'] || 0, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const latenciaMedia = provedores.reduce((acc, p) => acc + (p.latencia_media_ms || 0), 0) / (provedores.length || 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics de Provedores</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Monitore a saúde e performance dos seus provedores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Provedores</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{provedores.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Saudáveis</p>
                <p className="text-2xl font-bold text-green-600">
                  {statusDistribution['Saudável'] || 0}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Latência Média</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {Math.round(latenciaMedia)}ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Taxa Sucesso</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {provedores.length > 0 
                    ? Math.round(((statusDistribution['Saudável'] || 0) / provedores.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)]">Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-[var(--text-secondary)] py-8">Sem dados para exibir</p>
            )}
          </CardContent>
        </Card>

        <SuccessRateChart historico={historico} />
      </div>

      <LatencyTrendChart historico={historico} />
      
      <AvailabilityHeatmap historico={historico} provedores={provedores} />

      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Ranking de Provedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {provedores
              .sort((a, b) => (a.latencia_media_ms || 999999) - (b.latencia_media_ms || 999999))
              .map((p, idx) => (
                <div 
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[var(--text-secondary)]">#{idx + 1}</span>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{p.nome}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{p.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      p.saude_status === 'Saudável' ? 'default' :
                      p.saude_status === 'Degradado' ? 'secondary' : 'destructive'
                    }>
                      {p.saude_status || 'Desconhecido'}
                    </Badge>
                    <span className="text-sm font-mono text-[var(--text-primary)]">
                      {p.latencia_media_ms || 0}ms
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}