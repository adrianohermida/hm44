import React from 'react';
import { Badge } from '@/components/ui/badge';
import SchemaComparator from '../schema/SchemaComparator';

export default function VersionComparator({ versaoA, versaoB }) {
  if (!versaoA || !versaoB) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge>{versaoA.versao}</Badge>
        <span className="text-xs text-[var(--text-secondary)]">vs</span>
        <Badge>{versaoB.versao}</Badge>
      </div>
      <SchemaComparator 
        schemaAnterior={versaoA.schema} 
        schemaAtual={versaoB.schema} 
      />
    </div>
  );
}