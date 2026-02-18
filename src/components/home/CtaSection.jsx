import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section className="py-20 bg-[var(--brand-primary)]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Pronto para Recuperar Sua Liberdade Financeira?</h2>
        <p className="text-xl text-white/90 mb-8">Fale com um especialista gratuitamente e descubra a melhor solução para seu caso</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-[var(--brand-primary)] hover:bg-[var(--brand-bg-tertiary)] px-8 py-6 text-lg font-semibold shadow-lg">
            Agendar Consulta Gratuita
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold flex items-center gap-2">
            Calcular Dívidas <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}