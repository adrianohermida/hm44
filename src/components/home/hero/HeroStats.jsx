import React from 'react';

export default function HeroStats() {
  const stats = [
    { value: '10k+', label: 'Clientes Atendidos' },
    { value: '95%', label: 'Taxa de Sucesso' },
    { value: '70%', label: 'Redução Média' }
  ];

  return (
    <div className="grid grid-cols-3 gap-8 mt-12">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-sm text-white/80">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}