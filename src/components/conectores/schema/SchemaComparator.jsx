import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react';

export default function SchemaComparator({ schemaAnterior, schemaAtual }) {
  const compare = () => {
    const added = [];
    const removed = [];
    const changed = [];

    const checkKeys = (old, curr, path = '') => {
      const oldKeys = Object.keys(old || {});
      const currKeys = Object.keys(curr || {});

      currKeys.forEach(k => {
        const fullPath = path ? `${path}.${k}` : k;
        if (!oldKeys.includes(k)) added.push(fullPath);
        else if (typeof curr[k] !== typeof old[k]) changed.push(fullPath);
      });

      oldKeys.forEach(k => {
        const fullPath = path ? `${path}.${k}` : k;
        if (!currKeys.includes(k)) removed.push(fullPath);
      });
    };

    checkKeys(schemaAnterior, schemaAtual);
    return { added, removed, changed };
  };

  const { added, removed, changed } = compare();
  const hasBreaking = removed.length > 0 || changed.length > 0;

  return (
    <div className="space-y-2 text-sm">
      {hasBreaking && (
        <Badge className="bg-red-500/20 text-red-400">
          <AlertTriangle className="w-3 h-3 mr-1" /> Breaking Changes
        </Badge>
      )}
      {added.length > 0 && (
        <div className="text-green-400 text-xs">
          <Plus className="w-3 h-3 inline mr-1" /> {added.length} campos adicionados
        </div>
      )}
      {removed.length > 0 && (
        <div className="text-red-400 text-xs">
          <Minus className="w-3 h-3 inline mr-1" /> {removed.length} campos removidos
        </div>
      )}
      {changed.length > 0 && (
        <div className="text-amber-400 text-xs">
          <RefreshCw className="w-3 h-3 inline mr-1" /> {changed.length} tipos alterados
        </div>
      )}
    </div>
  );
}