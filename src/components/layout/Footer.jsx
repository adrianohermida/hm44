import React from 'react';
import { createPageUrl } from '@/utils';
import FooterBrand from './footer/FooterBrand';
import FooterNav from './footer/FooterNav';
import FooterSocial from './footer/FooterSocial';
import FooterNewsletter from './footer/FooterNewsletter';
import FooterLegal from './footer/FooterLegal';

export default function Footer() {
  const services = [
    { label: 'Defesa do Superendividado', to: '#' },
    { label: 'Revisão de Contratos Bancários', to: '#' },
    { label: 'Renegociação de Dívidas', to: '#' },
    { label: 'Plano de Pagamento Judicial', to: '#' },
    { label: 'Exclusão do SPC/Serasa', to: '#' }
  ];

  const institutional = [
    { label: 'Sobre o Dr. Adriano', to: createPageUrl('About') },
    { label: 'Como Funciona', to: createPageUrl('Home') },
    { label: 'Depoimentos', to: createPageUrl('Home') },
    { label: 'Blog Jurídico', to: createPageUrl('News') },
    { label: 'Fale Conosco', to: createPageUrl('Contact') }
  ];

  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] border-t border-[var(--footer-border)]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <FooterBrand />
          <FooterNav title="Serviços" links={services} />
          <FooterNav title="Institucional" links={institutional} />
          <div className="space-y-6">
            <FooterSocial />
            <FooterNewsletter />
          </div>
        </div>
        <FooterLegal />
      </div>
    </footer>
  );
}