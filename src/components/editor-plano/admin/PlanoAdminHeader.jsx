import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function PlanoAdminHeader({ cliente }) {
  if (!cliente) return null;

  return (
    <div className="bg-[var(--brand-primary-50)] p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Cliente Selecionado</p>
          <p className="font-semibold text-[var(--text-primary)]">{cliente.nome_completo}</p>
        </div>
        <Badge className="bg-[var(--brand-primary)]">{cliente.cpf}</Badge>
      </div>
    </div>
  );
}