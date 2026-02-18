import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function KanbanBoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3].map((col) => (
        <Card key={col} className="flex-1 min-w-[300px]">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3].map((card) => (
              <div key={card} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}