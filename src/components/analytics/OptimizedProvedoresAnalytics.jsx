import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

const STATUS_COLORS = {
  'Saudável': '#10b981',
  'Degradado': '#f59e0b',
  'Indisponível': '#ef4444',
  'Desconhecido': '#6b7280'
};

export default function OptimizedProvedoresAnalytics({ provedores = [] }) {
  const stats = useMemo(() => {
    if (!provedores.length) return { total: 0, saudaveis: 0, latenciaMedia: 0, taxaSucessoMedia: 0 };
    
    const total = provedores.length;
    const saudaveis = provedores.filter(p => p.saude_status === 'Saudável').length;
    const latenciaMedia = Math.round(
      provedores.reduce((acc, p) => acc + (p.latencia_media_ms || 0), 0) / total
    );
    const taxaSucessoMedia = Math.round(
      provedores.reduce((acc, p) => acc + (p.taxa_sucesso || 0), 0) / total
    );

    return { total, saudaveis, latenciaMedia, taxaSucessoMedia };
  }, [provedores]);

  const chartData = useMemo(() => {
    const statusCount = provedores.reduce((acc, p) => {
      acc[p.saude_status || 'Desconhecido'] = (acc[p.saude_status || 'Desconhecido'] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [provedores]);

  const StatCard = React.memo(({ icon: Icon, label, value, color }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ));
  
  StatCard.displayName = 'StatCard';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Total Provedores" value={stats.total} color="blue" />
        <StatCard icon={Zap} label="Saudáveis" value={stats.saudaveis} color="green" />
        <StatCard icon={Clock} label="Latência Média" value={`${stats.latenciaMedia}ms`} color="yellow" />
        <StatCard icon={TrendingUp} label="Taxa Sucesso" value={`${stats.taxaSucessoMedia}%`} color="purple" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribuição de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}