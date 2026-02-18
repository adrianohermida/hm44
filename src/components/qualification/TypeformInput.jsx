import React from 'react';
import { Input } from '@/components/ui/input';

export default function TypeformInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="text-lg py-6 border-2 focus:border-[var(--brand-primary)]"
      autoFocus
    />
  );
}