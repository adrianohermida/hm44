import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export default function EditorPlanoHeader({ onSalvar, onCancelar }) {
  return (
    <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 flex items-center justify-between">
      <h2 className="font-semibold text-[var(--text-primary)]">Novo Plano de Pagamento</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancelar}>
          <X className="w-4 h-4 mr-1" />
          Cancelar
        </Button>
        <Button size="sm" onClick={onSalvar} className="bg-[var(--brand-primary)]">
          <Save className="w-4 h-4 mr-1" />
          Salvar
        </Button>
      </div>
    </div>
  );
}