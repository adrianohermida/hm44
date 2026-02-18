import React from 'react';
import HelpdeskBreakdownChart from './HelpdeskBreakdownChart';

export default function AnalyticsChartsGrid({ charts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <HelpdeskBreakdownChart 
        data={charts.canais} 
        title="Tickets por Canal" 
      />
      <HelpdeskBreakdownChart 
        data={charts.prioridades} 
        title="Tickets por Prioridade" 
      />
      <HelpdeskBreakdownChart 
        data={charts.status} 
        title="Tickets por Status" 
      />
    </div>
  );
}