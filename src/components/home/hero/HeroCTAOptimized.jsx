import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroCTAOptimized({ gatilho, onTrackClick }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (gatilho?.id) onTrackClick?.(gatilho.id);
    navigate(createPageUrl('Qualificacao'));
  };

  const ctaText = gatilho?.cta_texto || 'Descubra Quanto Você Pode Economizar';

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
      <Button 
        onClick={handleClick} 
        size="lg" 
        className="w-full sm:w-auto bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white text-base sm:text-lg md:text-xl px-6 py-5 sm:px-8 sm:py-6 md:px-10 md:py-7 shadow-xl rounded-xl transition-all hover:scale-105 active:scale-95 min-h-[56px] sm:min-h-[64px]"
      >
        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
        <span className="flex-1 text-center">{ctaText}</span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
      </Button>
    </div>
  );
}