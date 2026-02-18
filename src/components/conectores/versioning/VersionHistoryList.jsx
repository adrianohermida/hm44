import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, GitBranch } from 'lucide-react';
import moment from 'moment';

export default function VersionHistoryList({ versoes, onSelect }) {
  return (
    <div className="space-y-2">
      {versoes.map((v, i) => (
        <div 
          key={i} 
          className="p-3 bg-[var(--bg-secondary)] rounded-lg cursor-pointer hover:bg-[var(--bg-tertiary)]"
          onClick={() => onSelect(v)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="font-medium">{v.versao}</span>
              {i === 0 && <Badge>Atual</Badge>}
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <Clock className="w-3 h-3" />
              {moment(v.created_date).fromNow()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}