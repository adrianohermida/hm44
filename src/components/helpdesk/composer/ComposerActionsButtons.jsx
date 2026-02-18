import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, StickyNote, Forward, Zap } from 'lucide-react';

export default function ComposerActionsButtons({ 
  onToggleAI, 
  onToggleNota, 
  onEncaminhar,
  onToggleTemplates 
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggleAI}
        title="Sugestões de IA"
      >
        <Sparkles className="w-4 h-4 mr-1" />
        IA
      </Button>
      
      {onToggleTemplates && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleTemplates}
          title="Templates rápidos"
        >
          <Zap className="w-4 h-4 mr-1" />
          Templates
        </Button>
      )}
      
      {onToggleNota && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleNota}
          title="Adicionar nota interna"
        >
          <StickyNote className="w-4 h-4 mr-1" />
          Nota
        </Button>
      )}
      
      {onEncaminhar && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEncaminhar}
          title="Encaminhar email"
        >
          <Forward className="w-4 h-4 mr-1" />
          Encaminhar
        </Button>
      )}
    </div>
  );
}