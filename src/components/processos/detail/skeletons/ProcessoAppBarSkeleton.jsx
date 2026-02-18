import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProcessoAppBarSkeleton() {
  return (
    <div className="sticky top-0 z-10 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}