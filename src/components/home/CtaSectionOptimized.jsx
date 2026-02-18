import React from 'react';
import { ArrowRight, Phone, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function CtaSectionOptimized({ onScrollToCalc }) {
  return (
    <section className="py-20 bg-[var(--brand-primary)]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Pronto para Recuperar Sua Liberdade Financeira?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Entre em contato com um especialista gratuitamente e descubra a melhor solução jurídica para seu caso
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => window.open('https://wa.me/5551996032004?text=Olá, quero falar com um especialista', '_blank')}
            className="bg-white text-[var(--brand-primary)] hover:bg-[var(--bg-tertiary)] px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            <Phone className="w-5 h-5 mr-2" />
            Falar com Advogado
          </Button>
          <Button 
            size="lg"
            onClick={() => window.location.href = createPageUrl('EditorPlano')}
            className="bg-[#0a0e1a] text-[var(--brand-primary)] hover:bg-white hover:text-[var(--brand-primary)] px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto border-2 border-[var(--brand-primary)]"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Monte seu Plano
          </Button>
        </div>
      </div>
    </section>
  );
}