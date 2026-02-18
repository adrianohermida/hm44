import React from 'react';
import { Scale, Phone, Mail, MapPin, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FooterOptimized() {
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
                <h3 className="font-bold text-white">Dr. Adriano Hermida Maia</h3>
                <p className="text-xs text-gray-400">Defesa do Devedor</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Especialistas em superendividamento, revisão bancária e recuperação judicial. Mais de 10 anos defendendo seus direitos.
            </p>
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>Porto Alegre, RS, Brasil</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Produtos e Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={createPageUrl("Templates")} className="hover:text-[var(--brand-primary)] transition-colors">Modelos Jurídicos</Link></li>
              <li><Link to={createPageUrl("Jobs")} className="hover:text-[var(--brand-primary)] transition-colors">Radar de Conciliação</Link></li>
              <li><Link to={createPageUrl("JobMatcher")} className="hover:text-[var(--brand-primary)] transition-colors">Plano de Pagamento</Link></li>
              <li><Link to={createPageUrl("Analytics")} className="hover:text-[var(--brand-primary)] transition-colors">Monitoramento de Processos</Link></li>
              <li><Link to={createPageUrl("News")} className="hover:text-[var(--brand-primary)] transition-colors">Notícias Jurídicas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={createPageUrl("About")} className="hover:text-[var(--brand-primary)] transition-colors">Sobre o Escritório</Link></li>
              <li><Link to={createPageUrl("Contact")} className="hover:text-[var(--brand-primary)] transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Conecte-se</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://instagram.com/dr.adrianohermidamaia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[var(--navy-800)] hover:bg-[var(--brand-primary)] rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mb-2">Atendimento: Segunda a sexta, 9h às 17h (Brasília)</p>
          </div>
        </div>

        <div className="border-t border-[var(--navy-800)] pt-6 text-center text-xs text-gray-400">
          <p className="mb-2">© 2025 Hermida Maia Advocacia. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ em Porto Alegre</p>
        </div>
      </div>
    </footer>
  );
}