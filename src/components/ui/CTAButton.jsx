import React from 'react';
import { Button } from '@/components/ui/button';

export default function CTAButton({ children, variant = 'primary', icon: Icon, onClick, className = '' }) {
  const variants = {
    primary: 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] border-2 border-[var(--brand-primary)]',
    success: 'bg-[var(--brand-success)] hover:bg-[#0d9c6e] text-white shadow-lg',
  };

  return (
    <Button 
      onClick={onClick}
      className={`${variants[variant]} px-6 py-3 rounded-lg font-semibold transition-all ${className}`}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </Button>
  );
}