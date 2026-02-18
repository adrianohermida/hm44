import React from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';

export default function MediaOutletCard({ outlet, logo, quote, reach, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[var(--bg-elevated)] border-2 border-[var(--border-primary)] rounded-2xl p-6 hover:border-[var(--brand-primary)] transition-all hover:shadow-xl group"
    >
      <div className="flex items-center justify-between mb-4">
        {logo ? (
          <img src={logo} alt={outlet} className="h-8 object-contain" />
        ) : (
          <h3 className="font-bold text-[var(--text-primary)]">{outlet}</h3>
        )}
        <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed min-h-[60px]">
        {quote}
      </p>
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-primary)]">
        <TrendingUp className="w-4 h-4" />
        <span>{reach}</span>
      </div>
    </a>
  );
}