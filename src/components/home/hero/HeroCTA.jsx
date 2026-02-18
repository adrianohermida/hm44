import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroCTA({ onScrollToCalculator }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <Button 
        size="lg" 
        className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white px-8 py-6 text-lg"
      >
        Agendar Consulta <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <Button 
        onClick={onScrollToCalculator} 
        size="lg" 
        variant="outline" 
        className="border-2 border-gray-300 text-[var(--brand-text-primary)] hover:bg-[var(--brand-bg-secondary)] px-8 py-6 text-lg flex items-center gap-2"
      >
        <ArrowRight className="w-5 h-5" />
        Calcular Minhas Dívidas AGORA
      </Button>
    </div>
  );
}