import React from 'react';

export default function SectionContainer({ children, className = '', noPadding = false }) {
  return (
    <section className={`${noPadding ? 'py-0' : 'py-12 md:py-16 lg:py-20'} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}