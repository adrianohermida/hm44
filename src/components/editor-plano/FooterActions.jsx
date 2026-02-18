import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FooterActions({ current, total, onPrev, onNext, disablePrev }) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={disablePrev}
        size="sm"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>
      
      {current < total - 1 && (
        <Button onClick={onNext} className="bg-[var(--brand-primary)]" size="sm">
          <span className="hidden sm:inline">Próximo</span>
          <span className="sm:hidden">Avançar</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
}