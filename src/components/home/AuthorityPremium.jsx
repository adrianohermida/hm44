import React from "react";
import AuthorityPremiumStats from './authority-premium/AuthorityPremiumStats';
import AuthorityPremiumCTA from './authority-premium/AuthorityPremiumCTA';

export default function AuthorityPremium() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[var(--bg-secondary)] px-4" aria-labelledby="authority-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 id="authority-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
            Por que Escolher o Hermida Maia?
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Mais de 15 anos dedicados à defesa do superendividado
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <AuthorityPremiumStats />
          <AuthorityPremiumCTA />
        </div>
      </div>
    </section>
  );
}