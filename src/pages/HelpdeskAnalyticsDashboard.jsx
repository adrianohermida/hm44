import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { subDays } from 'date-fns';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import { useHelpdeskAnalytics } from '@/components/helpdesk/analytics/useHelpdeskAnalytics';
import AnalyticsKPICards from '@/components/helpdesk/analytics/AnalyticsKPICards';
import AnalyticsTrendChart from '@/components/helpdesk/analytics/AnalyticsTrendChart';
import AnalyticsDistributionCharts from '@/components/helpdesk/analytics/AnalyticsDistributionCharts';
import AnalyticsFilters from '@/components/helpdesk/analytics/AnalyticsFilters';
import AnalyticsAlerts from '@/components/helpdesk/analytics/AnalyticsAlerts';
import { AnalyticsDashboardError } from '@/components/helpdesk/analytics/AnalyticsDashboardError';
import { Loader2 } from 'lucide-react';

export default function HelpdeskAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user
  });

  const { isLoading, tickets = [], kpis, distribuicao, tendencia, alertas } = useHelpdeskAnalytics(
    escritorio?.id,
    dateRange
  );

  if (isLoading || !escritorio) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (kpis.totalTickets === 0) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb items={[
          { label: 'Atendimento', url: createPageUrl('Helpdesk') },
          { label: 'Analytics' }
        ]} />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="text-6xl">📊</div>
          <h3 className="text-xl font-semibold">Nenhum ticket neste período</h3>
          <p className="text-gray-600 text-sm">Ajuste o período ou aguarde novos tickets</p>
        </div>
      </div>
    );
  }

  return (
    <AnalyticsDashboardError>
      <div className="p-6 space-y-6">
        <Breadcrumb items={[
          { label: 'Atendimento', url: createPageUrl('Helpdesk') },
          { label: 'Analytics' }
        ]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics do Helpdesk</h1>
            <p className="text-sm text-gray-600">Dashboard executivo e KPIs tempo real</p>
          </div>

          <AnalyticsFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onReset={() => setDateRange({
              from: subDays(new Date(), 30),
              to: new Date()
            })}
            tickets={tickets}
          />
        </div>

        <AnalyticsAlerts alertas={alertas} />

        <AnalyticsKPICards kpis={kpis} />

        <AnalyticsTrendChart data={tendencia} />

        <AnalyticsDistributionCharts distribuicao={distribuicao} />
      </div>
    </AnalyticsDashboardError>
  );
}