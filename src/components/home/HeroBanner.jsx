import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-[var(--brand-primary)] to-emerald-600 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-white mb-6">
            Liberte-se das Dívidas com Segurança Jurídica
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Especialistas em defesa do consumidor e superendividamento. 
            Reduza suas dívidas em até 70%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-[var(--brand-primary)] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Consulta Gratuita <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Calcular Economia
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}