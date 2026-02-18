import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProvedorCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded animate-pulse" />
              <div className="h-3 w-48 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            <div className="h-8 w-8 bg-[var(--bg-tertiary)] rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}