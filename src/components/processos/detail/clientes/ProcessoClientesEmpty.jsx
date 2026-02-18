import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export default function ProcessoClientesEmpty({ onMarcar }) {
  return (
    <div className="text-center py-6">
      <UserPlus className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-3" />
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Nenhum cliente vinculado ao processo
      </p>
      <Button size="sm" onClick={onMarcar}>
        Marcar Cliente
      </Button>
    </div>
  );
}