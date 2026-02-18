import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ProcessoRelationBadge from './ProcessoRelationBadge';

export default function ProcessoTreeNode({ processo, children, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = children && children.length > 0;

  return (
    <div className="space-y-2">
      <Card 
        className="p-3 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
        onClick={() => onSelect(processo)}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-1"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)]">{processo.numero_cnj}</p>
            <p className="text-xs text-[var(--text-secondary)]">{processo.tribunal}</p>
          </div>
          {processo.relation_type && <ProcessoRelationBadge type={processo.relation_type} />}
        </div>
      </Card>
      {expanded && hasChildren && (
        <div className="ml-6 border-l-2 border-[var(--border-secondary)] pl-4">
          {children}
        </div>
      )}
    </div>
  );
}