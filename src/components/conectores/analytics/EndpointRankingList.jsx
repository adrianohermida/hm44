import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export default function EndpointRankingList({ endpoints }) {
  return (
    <div className="space-y-2">
      {endpoints.slice(0, 10).map((ep, i) => (
        <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="w-8 text-center">#{i + 1}</Badge>
            <span className="text-sm font-medium">{ep.nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">{ep.requisicoes}</span>
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>
        </div>
      ))}
    </div>
  );
}