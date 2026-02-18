import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClienteEmptyState({ onNovoCliente, temBusca }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <User className="w-8 h-8 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {temBusca ? 'Nenhum resultado encontrado' : 'Nenhum cliente cadastrado'}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        {temBusca ? 'Tente ajustar os filtros de busca' : 'Adicione seu primeiro cliente para começar'}
      </p>
      {!temBusca && (
        <Button onClick={onNovoCliente} className="bg-[var(--brand-primary)]">
          Adicionar Cliente
        </Button>
      )}
    </div>
  );
}