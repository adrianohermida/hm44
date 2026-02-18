import React from 'react';
import { Shield } from 'lucide-react';

export default function HeroHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-[var(--brand-bg-secondary)] border border-gray-200 px-4 py-2 rounded-full mb-6">
        <Shield className="w-4 h-4 text-[var(--brand-text-secondary)]" />
        <span className="text-sm font-semibold text-[var(--brand-text-secondary)]">
          Lei 14.181/2021 - Superendividamento
        </span>
      </div>
      
      <h1 className="text-4xl lg:text-6xl font-bold text-[var(--brand-text-primary)] mb-6 max-w-4xl mx-auto leading-tight">
        Recupere sua <span className="text-[var(--brand-primary)]">Liberdade Financeira</span>
      </h1>
      
      <p className="text-lg text-[var(--brand-text-secondary)] mb-8 max-w-3xl mx-auto">
        Defenda seus direitos contra abusos bancários, revise contratos e renegocie dívidas com suporte jurídico especializado. Mais de 2.000 planos homologados e R$ 35 milhões em dívidas renegociadas.
      </p>
    </div>
  );
}