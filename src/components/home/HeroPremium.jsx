import React from 'react';
import HeroPremiumBackground from './hero-premium/HeroPremiumBackground';
import HeroPremiumContent from './hero-premium/HeroPremiumContent';
import HeroPremiumImage from './hero-premium/HeroPremiumImage';
import HeroPremiumFloatingCards from './hero-premium/HeroPremiumFloatingCards';

export default function HeroPremium({ onScrollToCalc }) {
  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden bg-[var(--bg-primary)]" aria-labelledby="hero-heading">
      <HeroPremiumBackground />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <HeroPremiumContent onScrollToCalc={onScrollToCalc} />
          <HeroPremiumImage />
        </div>
      </div>

      <HeroPremiumFloatingCards />
    </section>
  );
}