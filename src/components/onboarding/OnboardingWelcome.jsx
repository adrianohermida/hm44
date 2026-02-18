import React from 'react';
import { Sparkles } from 'lucide-react';

export default function OnboardingWelcome({ userName }) {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-[var(--brand-primary-100)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-[var(--brand-primary)]" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
        Bem-vindo, {userName}!
      </h1>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto">
        Configure suas integrações do Google para aproveitar ao máximo nossa plataforma
      </p>
    </div>
  );
}