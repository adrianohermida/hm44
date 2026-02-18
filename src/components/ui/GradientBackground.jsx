import React from 'react';

export default function GradientBackground({ children, variant = 'primary' }) {
  const gradients = {
    primary: 'bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--brand-primary-50)]',
    hero: 'bg-gradient-to-br from-[var(--bg-primary-dark)] via-[#1a2942] to-[#0d1f35]',
    success: 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-700)]',
  };

  return (
    <div className={`${gradients[variant]} transition-colors duration-300`}>
      {children}
    </div>
  );
}