import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ label, value, sub, icon: Icon, color = 'brand', trend, isLoading }) {
  const colors = {
    brand: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]',
    blue:  'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red:   'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  if (isLoading) {
    return (
      <Card className="bg-[var(--bg-elevated)]">
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--bg-elevated)] hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text-secondary)] mb-1">{label}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] truncate">{value}</p>
            {sub && <p className="text-xs text-[var(--text-tertiary)] mt-1">{sub}</p>}
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl flex-shrink-0 ${colors[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend >= 0 ? '+' : ''}{trend}% vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}