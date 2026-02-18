import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FooterNav({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-[var(--footer-text)] mb-4 text-sm uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link, i) => (
          <li key={i}>
            <Link 
              to={link.to} 
              className="text-sm text-[var(--footer-text-muted)] hover:text-[var(--brand-primary)] transition-colors inline-block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}