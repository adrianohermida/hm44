import React from 'react';
import { Instagram, Linkedin, Facebook, Youtube, Phone, Mail } from 'lucide-react';

export default function FooterSocial() {
  const social = [
    { icon: Instagram, url: 'https://instagram.com/dr.adrianohermidamaia', label: 'Instagram' },
    { icon: Linkedin, url: 'https://linkedin.com/in/adrianohermidamaia', label: 'LinkedIn' },
    { icon: Youtube, url: 'https://youtube.com/@hermidamaia', label: 'YouTube' },
    { icon: Facebook, url: 'https://facebook.com/hermidamaia', label: 'Facebook' }
  ];

  return (
    <div>
      <h4 className="font-bold text-[var(--footer-text)] mb-4 text-sm uppercase tracking-wider">Contato</h4>
      <div className="space-y-3 mb-4">
        <a href="tel:+5551996032004" className="flex items-center gap-2 text-sm text-[var(--footer-text-muted)] hover:text-[var(--brand-primary)] transition-colors">
          <Phone className="w-4 h-4" />
          (51) 99603-2004
        </a>
        <a href="mailto:contato@hermidamaia.adv.br" className="flex items-center gap-2 text-sm text-[var(--footer-text-muted)] hover:text-[var(--brand-primary)] transition-colors">
          <Mail className="w-4 h-4" />
          contato@hermidamaia.adv.br
        </a>
      </div>
      <div className="flex gap-2">
        {social.map(({ icon: Icon, url, label }, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 bg-[var(--footer-input-bg)] hover:bg-[var(--brand-primary)] rounded-lg flex items-center justify-center transition-colors group"
          >
            <Icon className="w-4 h-4 text-[var(--footer-text-muted)] group-hover:text-[var(--text-on-primary)] transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}