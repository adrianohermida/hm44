import React from 'react';
import { Shield, Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function HeroPremiumContent({ onScrollToCalc }) {
  const { data: gatilho } = useQuery({
    queryKey: ['gatilho-hero'],
    queryFn: async () => {
      const gatilhos = await base44.entities.GatilhoMarketing.filter({ 
        tipo_conteudo: 'hero', 
        status: 'ativo' 
      }, '-created_date', 1);
      return gatilhos[0] || null;
    },
    staleTime: 5 * 60 * 1000
  });

  const heroData = gatilho || {
    badge_texto: 'Lei 14.181/2021 • Vigente desde 2021',
    headline_primaria: 'Elimine Até 70% das Suas Dívidas Legalmente',
    headline_secundaria: 'Advocacia especializada em superendividamento. Mais de R$ 35 milhões renegociados com 98% de sucesso.',
    cta_primario_texto: 'Calcular Gratuitamente',
    cta_secundario_texto: 'Falar com Especialista',
    cta_secundario_link: 'https://wa.me/5511999999999'
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
      {heroData.badge_texto && (
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600 px-4 py-2 rounded-full shadow-md border border-amber-600/20">
          <Shield className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-bold text-gray-900">
            {heroData.badge_texto}
          </span>
        </div>
      )}

      <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-tight">
        {heroData.headline_primaria?.split('70%')[0]}
        <span className="text-[var(--brand-primary)]">
          {heroData.headline_primaria?.includes('70%') ? '70%' : ''}
        </span>
        {heroData.headline_primaria?.split('70%')[1]}
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl font-medium text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0">
        {heroData.headline_secundaria}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start flex-wrap">
        {heroData.cta_primario_texto && (
          <Button
            onClick={onScrollToCalc}
            size="lg"
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 h-12 md:h-14 px-4 md:px-8 text-xs md:text-base font-semibold w-full sm:w-auto min-w-[200px] whitespace-nowrap"
            aria-label={heroData.cta_primario_texto}
          >
            <Calculator className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" aria-hidden="true" />
            <span className="truncate">{heroData.cta_primario_texto}</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1.5 md:ml-2" aria-hidden="true" />
          </Button>
        )}

        {heroData.cta_secundario_texto && heroData.cta_secundario_link && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] h-12 md:h-14 px-4 md:px-8 text-xs md:text-base font-semibold bg-[var(--bg-elevated)] w-full sm:w-auto min-w-[200px] whitespace-nowrap"
          >
            <a href={heroData.cta_secundario_link} target="_blank" rel="noopener noreferrer" aria-label={heroData.cta_secundario_texto}>
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" aria-hidden="true" />
              <span className="truncate">{heroData.cta_secundario_texto}</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}