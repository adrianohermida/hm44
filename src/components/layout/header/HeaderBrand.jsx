import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale } from 'lucide-react';

export default function HeaderBrand() {
  return (
    <Link to={createPageUrl('Home')} className="flex items-center gap-2 min-w-0">
      <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
        <Scale className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <h1 className="font-bold text-base leading-tight text-[var(--header-text)] truncate">
          Dr. Adriano Hermida Maia
        </h1>
        <p className="text-xs text-[var(--text-secondary)] leading-tight truncate">Defesa do Superendividado</p>
      </div>
    </Link>
  );
}