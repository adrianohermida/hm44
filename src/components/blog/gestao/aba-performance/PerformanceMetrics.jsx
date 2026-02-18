import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Eye, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default React.memo(function PerformanceMetrics({ escritorioId }) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['blog-real-analytics', escritorioId],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('getBlogRealAnalytics', { escritorioId });
      return data;
    },
    enabled: !!escritorioId,
    staleTime: 5 * 60 * 1000
  });

  if (isLoading) return <div className="grid md:grid-cols-4 gap-4 animate-pulse">
    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded" />)}
  </div>;

  const metricas = [
    { label: 'Total Views', valor: analytics?.data?.totalVisitas || 0, icon: Eye, cor: 'blue' },
    { label: 'Score SEO Médio', valor: analytics?.data?.scoreSEOMedio || 0, icon: TrendingUp, cor: 'green' },
    { label: 'Taxa Engajamento', valor: `${analytics?.data?.taxaEngajamento || 0}%`, icon: Clock, cor: 'purple' },
    { label: 'Total Comentários', valor: analytics?.data?.totalComentarios || 0, icon: DollarSign, cor: 'orange' }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {metricas.map((m, i) => (
        <Card key={i} className="p-4">
          <m.icon className={`w-8 h-8 mb-2 text-${m.cor}-600`} />
          <div className="text-2xl font-bold">{m.valor}</div>
          <div className="text-sm text-gray-600">{m.label}</div>
        </Card>
      ))}
    </div>
  );
});