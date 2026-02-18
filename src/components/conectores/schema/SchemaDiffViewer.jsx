import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, RefreshCw } from 'lucide-react';

export default function SchemaDiffViewer({ diff }) {
  if (!diff) return null;

  return (
    <div className="space-y-2 text-xs">
      {diff.added?.map((campo, i) => (
        <div key={i} className="flex items-center gap-2 text-green-400">
          <Plus className="w-3 h-3" /> {campo}
        </div>
      ))}
      {diff.removed?.map((campo, i) => (
        <div key={i} className="flex items-center gap-2 text-red-400">
          <Minus className="w-3 h-3" /> {campo}
        </div>
      ))}
      {diff.changed?.map((campo, i) => (
        <div key={i} className="flex items-center gap-2 text-amber-400">
          <RefreshCw className="w-3 h-3" /> {campo}
        </div>
      ))}
    </div>
  );
}