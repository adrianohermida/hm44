import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, Zap } from 'lucide-react';

export default function CacheStatusBadge({ cacheHit, ttl }) {
  return (
    <Badge variant="outline" className={cacheHit ? 'bg-green-500/20 text-green-400' : ''}>
      {cacheHit ? (
        <>
          <Zap className="w-3 h-3 mr-1" /> Cache Hit
        </>
      ) : (
        <>
          <Database className="w-3 h-3 mr-1" /> Cache Miss
        </>
      )}
      {ttl && <span className="ml-1 text-xs">({ttl}s)</span>}
    </Badge>
  );
}