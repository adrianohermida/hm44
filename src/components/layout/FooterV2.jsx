import React from 'react';
import { Scale, MapPin, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FooterV2() {
  return (
    <footer className="bg-[var(--navy-900)] text-gray-300 border-t border-[var(--navy-700)]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Dr. Adriano Hermida Maia</h3>
                <p className="text-xs text-gray-400">Defesa do Devedor</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[var(--brand-primary)]" />
              Porto Alegre, RS
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={createPageUrl('Templates')} className="hover:text-[var(--brand-primary)] transition-colors">Modelos Jurídicos</Link></li>
              <li><Link to={createPageUrl('JobMatcher')} className="hover:text-[var(--brand-primary)] transition-colors">Plano de Pagamento</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={createPageUrl('About')} className="hover:text-[var(--brand-primary)] transition-colors">Sobre</Link></li>
              <li><Link to={createPageUrl('Contact')} className="hover:text-[var(--brand-primary)] transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Redes Sociais</h4>
            <div className="flex gap-3">
              <a href="https://instagram.com/dr.adrianohermidamaia" className="w-9 h-9 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--navy-800)] pt-6 text-center text-xs text-gray-400">
          <p>© 2025 Hermida Maia Advocacia</p>
        </div>
      </div>
    </footer>
  );
}