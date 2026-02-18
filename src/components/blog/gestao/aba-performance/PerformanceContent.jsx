import React from 'react';
import PerformanceHeader from './PerformanceHeader';
import PerformanceMetrics from './PerformanceMetrics';
import PerformanceFunil from './PerformanceFunil';
import PerformanceSEO from './PerformanceSEO';
import PerformanceDashboard from '@/components/blog/performance/PerformanceDashboard';
import ArtigosPerformanceTable from '@/components/blog/performance/ArtigosPerformanceTable';

export default function PerformanceContent({ escritorioId, artigos, keywords, onRefresh, isRefreshing }) {
  if (!escritorioId) return null;

  return (
    <div className="space-y-6">
      <PerformanceHeader onRefresh={onRefresh} isRefreshing={isRefreshing} />
      <PerformanceMetrics escritorioId={escritorioId} />
      <div className="grid lg:grid-cols-2 gap-6 auto-rows-fr">
        <PerformanceDashboard escritorioId={escritorioId} />
        <PerformanceFunil escritorioId={escritorioId} />
      </div>
      <PerformanceSEO escritorioId={escritorioId} keywords={keywords} />
      <ArtigosPerformanceTable artigos={artigos} />
    </div>
  );
}