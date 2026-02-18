import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DuplicateDetector({ endpoints }) {
  const duplicates = endpoints.reduce((acc, ep) => {
    const key = `${ep.metodo}-${ep.path}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  const duplicateGroups = Object.entries(duplicates)
    .filter(([_, eps]) => eps.length > 1)
    .map(([key, eps]) => ({ key, endpoints: eps }));

  if (duplicateGroups.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">
          {duplicateGroups.length} endpoints duplicados detectados
        </h3>
      </div>
      <div className="space-y-2 text-sm">
        {duplicateGroups.slice(0, 3).map(({ key, endpoints: eps }) => (
          <div key={key} className="flex items-center gap-2">
            <Badge variant="outline">{eps[0].metodo}</Badge>
            <code className="text-xs">{eps[0].path}</code>
            <span className="text-yellow-700">({eps.length} duplicatas)</span>
          </div>
        ))}
        {duplicateGroups.length > 3 && (
          <p className="text-yellow-700">... e mais {duplicateGroups.length - 3}</p>
        )}
      </div>
    </div>
  );
}