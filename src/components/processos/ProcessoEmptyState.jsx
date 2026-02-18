import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export default function ProcessoEmptyState({ onNovoProcesso, temBusca }) {
  if (temBusca) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Nenhum processo encontrado</h3>
        <p className="text-[var(--text-secondary)] mb-4">Tente ajustar os filtros de busca</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Nenhum processo cadastrado</h3>
      <p className="text-[var(--text-secondary)] mb-4">Adicione seu primeiro processo manualmente ou busque na base de dados</p>
      <Button onClick={onNovoProcesso} className="bg-[var(--brand-primary)]">
        <Plus className="w-4 h-4 mr-2" />Novo Processo
      </Button>
    </div>
  );
}