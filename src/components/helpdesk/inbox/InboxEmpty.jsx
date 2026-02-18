import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InboxEmpty({ onResetFiltros }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        Nenhum ticket encontrado
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        Ajuste os filtros ou crie um novo ticket
      </p>
      {onResetFiltros && (
        <Button variant="outline" size="sm" onClick={onResetFiltros}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}