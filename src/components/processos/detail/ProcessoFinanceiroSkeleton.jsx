import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ProcessoFinanceiroSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-[var(--bg-tertiary)] rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-[var(--bg-tertiary)] rounded" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}