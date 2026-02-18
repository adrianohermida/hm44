import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FiltrosBar({ filters, onChange }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {filters.map(filter => (
        <Select 
          key={filter.key}
          value={filter.value} 
          onValueChange={v => onChange(filter.key, v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}