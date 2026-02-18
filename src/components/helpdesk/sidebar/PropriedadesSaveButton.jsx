import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function PropriedadesSaveButton({ onClick, disabled, isLoading }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full"
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      Atualizar
    </Button>
  );
}