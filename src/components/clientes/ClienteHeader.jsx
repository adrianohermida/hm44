import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ClienteHeader({ totalClientes, onNovoCliente }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Pessoas</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {totalClientes} {totalClientes === 1 ? 'contato' : 'contatos'}
        </p>
      </div>
      <Button onClick={onNovoCliente} className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]">
        <Plus className="w-4 h-4 mr-2" />Novo Cliente
      </Button>
    </div>
  );
}