import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { subDays } from 'date-fns';
import Breadcrumb from '@/components/seo/Breadcrumb';
import HelpdeskDateFilter from '@/components/helpdesk/analytics/HelpdeskDateFilter';
import HelpdeskTimeChart from '@/components/helpdesk/analytics/HelpdeskTimeChart';
import AnalyticsKPISection from '@/components/helpdesk/analytics/AnalyticsKPISection';
import AnalyticsChartsGrid from '@/components/helpdesk/analytics/AnalyticsChartsGrid';
import AnalyticsMetricsCards from '@/components/helpdesk/analytics/AnalyticsMetricsCards';
import { useHelpdeskAnalytics } from '@/components/helpdesk/analytics/useHelpdeskAnalytics';

export default function HelpdeskAnalytics() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: analytics, isLoading } = useHelpdeskAnalytics(escritorio?.id, dateRange);

  if (isLoading || !analytics) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  const { kpis, charts } = analytics;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb items={[{ label: 'Atendimento', url: '/Helpdesk' }, { label: 'Analytics' }]} />
          <h1 className="text-3xl font-bold mt-2">Analytics de Atendimento</h1>
        </div>
        <HelpdeskDateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <AnalyticsKPISection kpis={kpis} />
      <HelpdeskTimeChart data={charts.timeline} title="Tickets Criados (Últimos 30 Dias)" />
      <AnalyticsChartsGrid charts={charts} />
      <AnalyticsMetricsCards kpis={kpis} />
    </div>
  );
}