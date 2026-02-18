import React from 'react';

export default function GestaoBlogSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="flex justify-between items-center">
        <div className="h-10 w-64 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded" />
    </div>
  );
}