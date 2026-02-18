import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
        {label} {required && <span className="text-[var(--brand-error)]">*</span>}
      </label>
      <Select value={value} onValueChange={(val) => onChange(name, val)}>
        <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
          <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}