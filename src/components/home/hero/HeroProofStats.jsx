import React from 'react';

export default function HeroProofStats() {
  const stats = [
    { value: '4.9★', label: 'Avaliação' },
    { value: '98%', label: 'Sucesso' },
    { value: '24h', label: 'Resposta' }
  ];

  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl font-bold text-[var(--brand-text-primary)] mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-[var(--brand-text-secondary)]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}