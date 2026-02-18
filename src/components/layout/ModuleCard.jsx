import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ModuleCard({ icon: Icon, title, description, url }) {
  return (
    <Link 
      to={url}
      className="group block h-full"
    >
      <div className="h-full bg-white rounded-xl border border-[var(--brand-border-primary)] p-4 md:p-6 hover:shadow-lg hover:border-[var(--brand-primary)] transition-all duration-200 flex flex-col min-h-[140px] md:min-h-[160px]">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--brand-primary)]" />
          </div>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-text-tertiary)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-[var(--brand-text-primary)] mb-1.5 md:mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-[var(--brand-text-secondary)] flex-grow line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
}