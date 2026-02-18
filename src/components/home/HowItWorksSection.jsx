import React from 'react';
import { FileText, UserCheck, Gavel, CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    { icon: FileText, title: 'Agende uma Consulta', desc: 'Avaliamos seu caso por completo' },
    { icon: UserCheck, title: 'Estratégia Jurídica', desc: 'Desenvolvemos o melhor plano de ação' },
    { icon: Gavel, title: 'Negociação Especializada', desc: 'Representamos você junto aos credores' },
    { icon: CheckCircle, title: 'Solução Definitiva', desc: 'Você recupera sua liberdade financeira' }
  ];

  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-4">Como Funciona</h2>
        <p className="text-center text-[var(--text-secondary)] mb-12">Processo simples e transparente</p>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="relative text-center">
              <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              {i < steps.length - 1 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-1 bg-[var(--brand-primary-200)]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}