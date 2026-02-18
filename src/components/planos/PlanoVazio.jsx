import React from 'react';
import { FileText } from 'lucide-react';

export default function PlanoVazio() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Nenhum plano selecionado
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Selecione um plano na lista ou crie um novo
        </p>
      </div>
    </div>
  );
}