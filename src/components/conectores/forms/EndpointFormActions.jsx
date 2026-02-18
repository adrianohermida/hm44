import React from 'react';
import { Button } from '@/components/ui/button';

export default function EndpointFormActions({ onSave, onCancel, loading }) {
  return (
    <div className="flex gap-2 pt-4 border-t border-[var(--border-primary)]">
      <Button 
        onClick={onCancel} 
        variant="outline"
        disabled={loading}
        className="flex-1"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSave}
        disabled={loading}
        className="flex-1 bg-[var(--brand-primary)]"
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  );
}