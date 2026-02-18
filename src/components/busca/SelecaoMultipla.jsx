import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';

export default function SelecaoMultipla({ 
  processos, 
  selecionados, 
  onToggle, 
  onToggleTodos 
}) {
  const todosMarked = processos.length > 0 && selecionados.length === processos.length;

  return (
    <div className="flex items-center gap-2 mb-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleTodos}
      >
        {todosMarked ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
        {todosMarked ? 'Desmarcar todos' : 'Marcar todos'}
      </Button>
      <span className="text-sm text-[var(--text-secondary)]">
        {selecionados.length} de {processos.length} selecionado(s)
      </span>
    </div>
  );
}