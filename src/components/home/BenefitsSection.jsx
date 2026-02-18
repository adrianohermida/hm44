import React from 'react';
import { Shield, TrendingDown, Clock, Heart } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    { icon: Shield, title: 'Proteção Legal', desc: 'Amparo jurídico completo durante todo o processo' },
    { icon: TrendingDown, title: 'Redução de Dívidas', desc: 'Até 70% de desconto negociado' },
    { icon: Clock, title: 'Agilidade', desc: 'Solução em até 30 dias úteis' },
    { icon: Heart, title: 'Tranquilidade', desc: 'Fim das cobranças abusivas' }
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4">
        <h2 id="benefits-heading" className="text-4xl font-bold text-center text-[var(--text-primary)] mb-4">Resultados que Transformam Vidas</h2>
        <p className="text-center text-[var(--text-secondary)] mb-12">Benefícios reais de ter um especialista ao seu lado</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <article key={i} className="bg-[var(--bg-elevated)] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[var(--border-primary)]">
              <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}