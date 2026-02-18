import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function KPICardItem({ kpi }) {
  const Icon = kpi.icon;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
            {kpi.title}
          </CardTitle>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {kpi.subtitle}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${kpi.bg}`}>
          <Icon className={`w-4 h-4 ${kpi.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {kpi.value}
          </div>
          {kpi.trend && (
            <Badge 
              variant="secondary" 
              className={kpi.trend.startsWith('+') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}
            >
              {kpi.trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}