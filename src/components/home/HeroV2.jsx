import React from 'react';
import HeroHeaderOptimized from './hero/HeroHeaderOptimized';
import HeroCTAOptimized from './hero/HeroCTAOptimized';
import HeroStatsBar from './hero/HeroStatsBar';
import { useGatilhosAprovados } from '@/components/hooks/useGatilhosAprovados';
import { Star, Award, TrendingUp } from 'lucide-react';

export default function HeroV2({ onScrollToCalc }) {
  const { selectedGatilho, trackClique } = useGatilhosAprovados();

  const heroStats = [
    { icon: Star, value: '4.9★', label: 'Avaliação de Clientes' },
    { icon: Award, value: '98%', label: 'Casos de Sucesso' },
    { icon: TrendingUp, value: 'R$ 35M+', label: 'Dívidas Renegociadas' },
  ];

  return (
    <section className="relative min-h-[85vh] md:min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[var(--brand-primary-50)] via-[var(--brand-primary-100)] to-[var(--brand-primary-200)] overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djhoLThWMTZoOHptMCAxNnY4aC04di04aDh6bTE2LTE2djhoLThWMTZoOHptMCAxNnY4aC04di04aDh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <HeroHeaderOptimized gatilho={selectedGatilho} />
        <HeroCTAOptimized gatilho={selectedGatilho} onTrackClick={trackClique} />
        <HeroStatsBar stats={heroStats} />
      </div>
    </section>
  );
}