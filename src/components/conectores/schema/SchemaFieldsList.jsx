import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function SchemaFieldsList({ schema, maxDepth = 2 }) {
  const flatten = (obj, depth = 0, prefix = '') => {
    if (depth > maxDepth) return [];
    const fields = [];
    
    Object.entries(obj || {}).forEach(([key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const tipo = Array.isArray(val) ? 'array' : typeof val;
      fields.push({ path, tipo });
      
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        fields.push(...flatten(val, depth + 1, path));
      }
    });
    return fields;
  };

  const campos = flatten(schema);

  return (
    <div className="space-y-1 text-xs max-h-[300px] overflow-y-auto">
      {campos.map((c, i) => (
        <div key={i} className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded">
          <code className="text-[var(--brand-primary)]">{c.path}</code>
          <Badge variant="outline" className="text-xs">{c.tipo}</Badge>
        </div>
      ))}
    </div>
  );
}