import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch } from 'lucide-react';

export default function VersionSelector({ versoes, selecionada, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <GitBranch className="w-4 h-4 text-[var(--text-tertiary)]" />
      <Select value={selecionada} onValueChange={onChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {versoes.map(v => (
            <SelectItem key={v} value={v}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}