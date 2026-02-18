import React from 'react';
import { Star, Clock, TrendingUp, Users } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

export default function StatsBarOptimized() {
  const stats = [
    { value: '4.9★', label: 'Avaliação', icon: Star },
    { value: '10+', label: 'Anos de Atuação', icon: Clock },
    { value: '2.000+', label: 'Planos Homologados', icon: Users },
    { value: 'R$ 35M+', label: 'Negociados', icon: TrendingUp },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] py-12 border-y border-[var(--surface-3)]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
    </div>
  );
}