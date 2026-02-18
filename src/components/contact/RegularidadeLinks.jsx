import React from 'react';
import { ExternalLink, Scale } from 'lucide-react';

const links = [
  { label: 'CNSA - Sociedades de Advogados', url: 'https://cnsa.oab.org.br/' },
  { label: 'CNA - Cadastro Nacional de Advogados', url: 'https://cna.oab.org.br/' }
];

export default function RegularidadeLinks() {
  return (
    <div className="mt-4 pt-4 border-t border-[var(--border-secondary)]">
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
        Consulte Regularidade
      </h4>
      <div className="space-y-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[var(--brand-primary)] hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}