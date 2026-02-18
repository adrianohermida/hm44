import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AutoBlockToggle({ enabled, onToggle }) {
  return (
    <Button
      onClick={onToggle}
      variant={enabled ? 'default' : 'outline'}
      className={enabled ? 'bg-[var(--brand-primary)]' : ''}
      aria-pressed={enabled}
      aria-label={enabled ? 'Desativar bloqueio automático' : 'Ativar bloqueio automático'}
    >
      {enabled ? (
        <Lock className="w-4 h-4 mr-2" aria-hidden="true" />
      ) : (
        <Unlock className="w-4 h-4 mr-2" aria-hidden="true" />
      )}
      {enabled ? 'Bloqueio Ativo' : 'Bloqueio Inativo'}
    </Button>
  );
}