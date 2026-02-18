import React from 'react';
import ServiceCardOptimized from '@/components/ui/ServiceCardOptimized';
import { SERVICES } from '@/components/constants/services';

export default function ServicesOptimizedSEO() {
  return (
    <section id="servicos-section" className="py-20 bg-[var(--bg-primary)]" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Serviços Especializados
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
            Advocacia especializada em defesa do consumidor superendividado, revisão de contratos bancários, recuperação de crédito e direito financeiro
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCardOptimized key={i} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}