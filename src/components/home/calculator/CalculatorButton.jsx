import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function CalculatorButton({ 
  onClick, 
  loading, 
  children, 
  disabled 
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
          Calculando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}