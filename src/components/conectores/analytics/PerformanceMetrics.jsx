import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export default function PerformanceMetrics({ p50, p95, p99 }) {
  const getColor = (ms) => {
    if (ms < 200) return 'bg-green-500/20 text-green-400';
    if (ms < 500) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5" /> Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">P50</span>
          <Badge className={getColor(p50)}>{p50}ms</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">P95</span>
          <Badge className={getColor(p95)}>{p95}ms</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">P99</span>
          <Badge className={getColor(p99)}>{p99}ms</Badge>
        </div>
      </CardContent>
    </Card>
  );
}