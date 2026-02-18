import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function EndpointCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-[var(--bg-tertiary)] rounded animate-pulse" />
              <div className="h-3 w-64 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />
              <div className="h-6 w-12 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}