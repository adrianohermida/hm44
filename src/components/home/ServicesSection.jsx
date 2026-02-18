import React from 'react';
import { Scale, FileText, Users, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import ServiceCard from './services/ServiceCard';

export default function ServicesSection() {
  const services = [
    { icon: Shield, title: 'Defesa Contra Abusos Financeiros', desc: 'Anulação de cobranças ilegais, juros abusivos e leilões indevidos' },
    { icon: FileText, title: 'Superendividamento e Negociação', desc: 'Renegociação de dívidas com base na Lei 14.181/2021' },
    { icon: Scale, title: 'Recuperação Judicial Empresas', desc: 'Soluções para micro, pequenas e médias empresas' },
    { icon: Users, title: 'Reclamações Pré-Processuais', desc: 'Acordos com credores antes do processo judicial' },
    { icon: TrendingUp, title: 'Representação no BACEN', desc: 'Denúncias contra instituições financeiras' },
    { icon: AlertTriangle, title: 'Defesa Contra Fraudes', desc: 'Reversão de empréstimos indevidos e golpes no Pix' }
  ];

  return (
    <section className="py-20 bg-[var(--brand-bg-primary)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--brand-text-primary)] mb-4">
          Nossas Soluções Jurídicas para Você
        </h2>
        <p className="text-center text-[var(--brand-text-secondary)] mb-12">
          Suporte jurídico completo para reestruturação patrimonial e financeira
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}