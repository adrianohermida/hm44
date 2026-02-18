import React from 'react';
import HeroHeader from './hero/HeroHeader';
import HeroCTAOptimized from './hero/HeroCTAOptimized';
import HeroProofStats from './hero/HeroProofStats';
import HeroFeatureCards from './hero/HeroFeatureCards';

export default function HeroSection({ onScrollToCalculator }) {
  return (
    <section className="bg-[var(--brand-bg-primary)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <HeroHeader />
        <HeroCTAOptimized onScrollToCalculator={onScrollToCalculator} />
        <HeroProofStats />
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <HeroFeatureCards />
      </div>
    </section>
  );
}