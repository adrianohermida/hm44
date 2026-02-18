import React from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import PrazosAnalyticsDashboard from '@/components/prazos/analytics/PrazosAnalyticsDashboard';

export default function PrazosAnalytics() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', url: createPageUrl('Dashboard') },
            { label: 'Analytics de Prazos' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Analytics de Prazos
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Métricas e visualizações dos prazos do escritório
          </p>
        </div>

        <PrazosAnalyticsDashboard />
      </div>
    </div>
  );
}