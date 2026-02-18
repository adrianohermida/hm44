import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LatencyTrend({ atual, anterior }) {
  const diff = atual - anterior;
  const percent = anterior > 0 ? ((diff / anterior) * 100).toFixed(0) : 0;

  if (Math.abs(diff) < 10) {
    return (
      <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
        <Minus className="w-3 h-3" /> Estável
      </span>
    );
  }

  return (
    <span className={`text-xs flex items-center gap-1 ${diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
      {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(percent)}%
    </span>
  );
}