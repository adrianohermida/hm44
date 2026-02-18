import React from 'react';
import { Star, Clock, Users, TrendingUp } from 'lucide-react';

export default function StatsV2() {
  const stats = [
    { icon: Star, value: '4.9★', label: 'Avaliação' },
    { icon: Clock, value: '10+', label: 'Anos' },
    { icon: Users, value: '2.000+', label: 'Planos' },
    { icon: TrendingUp, value: 'R$ 35M+', label: 'Negociados' },
  ];

  return (
    <section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--brand-primary-100)] rounded-lg mb-3">
                <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}