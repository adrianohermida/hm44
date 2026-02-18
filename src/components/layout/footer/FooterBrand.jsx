import React from 'react';
import { Scale } from 'lucide-react';

export default function FooterBrand() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center">
          <Scale className="w-6 h-6 text-[var(--text-on-primary)]" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--footer-text)] text-sm">Dr. Adriano Hermida Maia</h3>
          <p className="text-xs text-[var(--footer-text-muted)]">Sociedade OAB/AM 62.017</p>
        </div>
      </div>
      <p className="text-sm text-[var(--footer-text-muted)] leading-relaxed">Especialista em Defesa do Devedor e Superendividamento. Mais de 12 anos protegendo consumidores contra abusos bancários.</p>
    </div>);

}