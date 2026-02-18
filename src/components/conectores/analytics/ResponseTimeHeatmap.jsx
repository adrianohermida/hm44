import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ResponseTimeHeatmap({ data }) {
  const getColor = (ms) => {
    if (ms < 200) return 'bg-green-500';
    if (ms < 500) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-24 gap-1">
      {data.map((d, i) => (
        <div 
          key={i} 
          className={`h-4 rounded ${getColor(d.tempo)} opacity-${Math.min(90, d.count * 10)}`}
          title={`${d.hora}: ${d.tempo}ms`}
        />
      ))}
    </div>
  );
}