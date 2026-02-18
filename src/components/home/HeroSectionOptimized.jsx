import React from 'react';
import { Phone, ArrowRight, Shield } from 'lucide-react';
import CTAButton from '@/components/ui/CTAButton';
import GradientBackground from '@/components/ui/GradientBackground';

export default function HeroSectionOptimized({ onScrollToCalculator }) {
  return (
    <GradientBackground variant="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-800)] px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <Shield className="w-4 h-4" />
            Lei 14.181/2021 - Superendividamento
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Recupere sua <span className="text-[var(--brand-primary)]">Liberdade Financeira</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Defenda seus direitos contra abusos bancários, revise contratos e renegocie dívidas com suporte jurídico especializado. Mais de 2.000 planos homologados e R$ 35 milhões em dívidas renegociadas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CTAButton 
              variant="primary"
              icon={Phone}
              onClick={() => window.open('https://wa.me/5551996032004?text=Olá, quero falar com um especialista', '_blank')}
            >
              Falar com Especialista
            </CTAButton>
            <CTAButton 
              variant="secondary"
              icon={ArrowRight}
              onClick={onScrollToCalculator}
            >
              Calcular Minhas Dívidas
            </CTAButton>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}