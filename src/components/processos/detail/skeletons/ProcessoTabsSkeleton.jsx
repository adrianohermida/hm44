import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProcessoTabsSkeleton() {
  return (
    <div className="sticky top-[64px] z-9 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
      <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
        <div className="flex gap-2 py-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-10 w-32 rounded-md flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}