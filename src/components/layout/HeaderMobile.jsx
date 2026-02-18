import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Scale } from 'lucide-react';

export default function HeaderMobile() {
  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--bg-tertiary)] px-4 py-3 md:hidden">
      <Link to={createPageUrl('Home')} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Hermida Maia</h1>
      </Link>
    </header>
  );
}