import React from 'react';

export default function PrazosWidgetSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-12 bg-gray-200 rounded" />
      ))}
    </div>
  );
}