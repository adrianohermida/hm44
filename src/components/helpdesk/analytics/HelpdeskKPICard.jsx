import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function HelpdeskKPICard({ kpi }) {
  const { title, value, subtitle, trend, icon: Icon, color = 'blue' } = kpi;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-3 h-3" />;
    return trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[var(--text-secondary)]">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{trend ? `${Math.abs(trend)}%` : '-'}</span>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">{subtitle}</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}