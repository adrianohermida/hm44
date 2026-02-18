import React from 'react';
import { Shield } from 'lucide-react';

const fallbackHeadlines = {
  urgencia: { primary: 'Sua Liberdade Financeira Começa Aqui:', secondary: 'Milhares de brasileiros já recuperaram o controle financeiro com nossa ajuda especializada' },
  transformacao: { primary: 'Sua Liberdade Financeira Começa Aqui:', secondary: 'Milhares de brasileiros já recuperaram o controle financeiro com nossa ajuda especializada' },
  autoridade: { primary: 'Sua Liberdade Financeira Começa Aqui:', secondary: 'Milhares de brasileiros já recuperaram o controle financeiro com nossa ajuda especializada' }
};

export default function HeroHeaderOptimized({ gatilho, variant = 'urgencia' }) {
  const headline = gatilho || fallbackHeadlines[variant] || fallbackHeadlines.urgencia;
  
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-10">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm">
        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="whitespace-nowrap">Lei 14.181/2021 • Vigente</span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4 leading-tight px-2">
        {headline.headline_primaria || headline.primary}{' '}
        <span className="text-[var(--brand-primary)] block sm:inline mt-1 sm:mt-0">Reduza Suas Dívidas em até 90%</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mb-2 px-4 max-w-3xl mx-auto">
        {headline.headline_secundaria || headline.secondary}
      </p>
    </div>
  );
}