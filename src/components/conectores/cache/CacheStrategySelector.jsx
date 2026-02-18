import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';

const STRATEGIES = [
  { value: 'none', label: 'Sem Cache' },
  { value: 'short', label: 'Curta (5min)' },
  { value: 'medium', label: 'Média (1h)' },
  { value: 'long', label: 'Longa (24h)' },
];

export default function CacheStrategySelector({ value, onChange }) {
  return (
    <div>
      <Label className="text-xs flex items-center gap-1">
        <Database className="w-3 h-3" /> Estratégia de Cache
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STRATEGIES.map(s => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}