import React from 'react';
import { ArrowRight, Calculator } from 'lucide-react';

export default function HeroActions({ onConsulta, onCalcular }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onConsulta}
        className="bg-white text-[var(--brand-primary)] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        Consulta Gratuita <ArrowRight className="w-5 h-5" />
      </button>
      <button
        onClick={onCalcular}
        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" /> Calcular Economia
      </button>
    </div>
  );
}