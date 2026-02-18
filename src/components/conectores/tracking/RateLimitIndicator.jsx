import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle } from 'lucide-react';

export default function RateLimitIndicator({ usado, limite, periodo }) {
  const percent = (usado / limite) * 100;
  const isWarning = percent > 80;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">
          {usado} / {limite} {periodo}
        </span>
        {isWarning && (
          <Badge className="bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> {percent.toFixed(0)}%
          </Badge>
        )}
      </div>
      <Progress value={percent} className={isWarning ? 'bg-amber-500' : ''} />
    </div>
  );
}