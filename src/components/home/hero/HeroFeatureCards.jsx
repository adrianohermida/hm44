import React from 'react';
import { Clock, Users, DollarSign } from 'lucide-react';

export default function HeroFeatureCards() {
  const features = [
    { icon: Clock, label: '10+ Anos de Atuação' },
    { icon: Users, label: '2.000+ Planos' },
    { icon: DollarSign, label: 'R$ 35M+ Negociados' }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {features.map(({ icon: Icon, label }, i) => (
        <div key={i} className="flex items-center gap-3 p-4 bg-[var(--brand-bg-secondary)] rounded-xl border border-gray-200 hover:shadow-md transition-all">
          <Icon className="w-8 h-8 text-[var(--brand-primary)]" />
          <div className="font-bold text-[var(--brand-text-primary)]">{label}</div>
        </div>
      ))}
    </div>
  );
}