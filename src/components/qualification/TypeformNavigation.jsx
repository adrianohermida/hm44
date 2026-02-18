import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function TypeformNavigation({ onNext, onBack, canProgress, isLast, isLoading }) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto px-4 mt-8">
      <Button variant="ghost" onClick={onBack} disabled={isLoading}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>
      <Button onClick={onNext} disabled={!canProgress || isLoading} className="bg-[var(--brand-primary)]">
        {isLast ? 'Finalizar' : 'Próximo'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}