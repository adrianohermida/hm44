import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function StatsOverviewCard({ title, value, icon: Icon, trend }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-[var(--text-secondary)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {Icon && <Icon className="w-8 h-8 text-[var(--brand-primary)]" />}
        </div>
        {trend !== undefined && (
          <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}% vs anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}