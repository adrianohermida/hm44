import React from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';

export default function PageHeader({ title, description, breadcrumbs }) {
  return (
    <div className="mb-4 md:mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3 md:mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--brand-text-primary)] mb-1.5 md:mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-[var(--brand-text-secondary)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}