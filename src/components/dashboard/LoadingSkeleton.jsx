import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="animate-pulse border-[var(--border-primary)]">
          <CardHeader className="p-4 space-y-2">
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-24 bg-[var(--bg-secondary)] rounded mb-3" />
            <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/3 mb-3" />
            <div className="flex gap-2">
              <div className="h-8 bg-[var(--bg-secondary)] rounded flex-1" />
              <div className="h-8 w-8 bg-[var(--bg-secondary)] rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}