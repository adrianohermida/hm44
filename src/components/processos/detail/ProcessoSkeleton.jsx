import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ProcessoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[var(--bg-tertiary)] rounded w-1/3" />
      <Card>
        <CardHeader>
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-[var(--bg-tertiary)] rounded" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-[var(--bg-tertiary)] rounded" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}