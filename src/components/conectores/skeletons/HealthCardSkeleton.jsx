import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function HealthCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          <div className="h-6 w-24 bg-[var(--bg-tertiary)] rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          <div className="h-6 w-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />
        </div>
        <div className="h-8 w-full bg-[var(--bg-tertiary)] rounded animate-pulse mt-4" />
      </CardContent>
    </Card>
  );
}