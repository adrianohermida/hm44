import React from 'react';
import { DollarSign } from 'lucide-react';

export default function HonorarioCard({ honorario, isSelected, onClick }) {
  const valorPendente = honorario.valor_total - (honorario.valor_pago || 0);
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-[var(--brand-primary-100)] border-l-4 border-[var(--brand-primary)]' 
          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-4 h-4 text-[var(--brand-primary)]" />
        <span className="font-medium text-[var(--text-primary)]">{honorario.tipo}</span>
      </div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Total:</span>
          <span className="font-semibold text-[var(--text-primary)]">
            R$ {honorario.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Pendente:</span>
          <span className="font-semibold text-[var(--brand-warning)]">
            R$ {valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </button>
  );
}