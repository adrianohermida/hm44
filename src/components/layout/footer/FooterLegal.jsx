import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { createPageUrl } from '@/utils';
import LegalDisclaimerCollapsible from '@/components/contact/LegalDisclaimerCollapsible';

export default function FooterLegal() {
  return (
    <div className="border-t border-[var(--footer-border)] pt-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-[var(--footer-text-muted)]">
          <Link to={`${createPageUrl('TermosLegais')}?tipo=politica_privacidade`} className="hover:text-[var(--brand-primary)] transition-colors">Política de Privacidade</Link>
          <Link to={`${createPageUrl('TermosLegais')}?tipo=termos_uso`} className="hover:text-[var(--brand-primary)] transition-colors">Termos de Uso</Link>
          <Link to={`${createPageUrl('TermosLegais')}?tipo=lgpd`} className="hover:text-[var(--brand-primary)] transition-colors">LGPD</Link>
          <Link to={`${createPageUrl('TermosLegais')}?tipo=cfm_normas`} className="hover:text-[var(--brand-primary)] transition-colors">Código de Ética</Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--footer-text-muted)]">
          <Shield className="w-3 h-3 text-[var(--brand-primary)]" />
          <span>Site Seguro SSL</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs text-[var(--footer-text-muted)]">
          © 2025 Hermida Maia Advocacia - Sociedade Unipessoal OAB/AM 62.017
        </p>
        <p className="text-xs text-[var(--footer-text-muted)]">
          Dr. Adriano Hermida Maia - OAB/SP 476.963 | OAB/RS 107.048 | OAB/DF 75.394 | OAB/AM 8.894
        </p>
      </div>
      <LegalDisclaimerCollapsible />
    </div>
  );
}