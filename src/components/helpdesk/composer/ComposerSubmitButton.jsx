import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ComposerSubmitButton({ onSubmit, onSubmitWithStatus, disabled, isLoading }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="submit"
        size="sm"
        disabled={disabled || isLoading}
        onClick={onSubmit}
        className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] rounded-r-none"
      >
        <Send className="w-4 h-4 mr-1" />
        Enviar
      </Button>
      
      {onSubmitWithStatus && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              disabled={disabled || isLoading}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] rounded-l-none border-l border-white/20 px-2"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSubmitWithStatus('aguardando_cliente')}>
              Enviar e definir como Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSubmitWithStatus('resolvido')}>
              Enviar e definir como Resolvido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSubmitWithStatus('fechado')}>
              Enviar e definir como Fechado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}