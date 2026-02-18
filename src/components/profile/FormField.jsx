import React from 'react';
import { Input } from '@/components/ui/input';

export default function FormField({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
        {label} {required && <span className="text-[var(--brand-error)]">*</span>}
      </label>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
      />
    </div>
  );
}