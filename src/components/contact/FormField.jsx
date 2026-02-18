import React from 'react';
import { Label } from '@/components/ui/label';

export default function FormField({ id, label, required, children }) {
  return (
    <div role="group" aria-labelledby={`${id}-label`}>
      <Label id={`${id}-label`} htmlFor={id} className="text-[var(--text-primary)]">
        {label} {required && <span className="text-[var(--brand-error)]" aria-label="obrigatório">*</span>}
      </Label>
      {children}
    </div>
  );
}