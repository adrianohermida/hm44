import React from "react";
import { Card } from "@/components/ui/card";

export default function VideoGalleryLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="aspect-video bg-[var(--bg-tertiary)]" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}