import React from 'react';
import { DollarSign } from 'lucide-react';

export default function ProcessoValorCausa({ valor, moeda = 'BRL' }) {
  if (!valor) return null;

  const formatValor = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda
    }).format(val);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-[var(--brand-primary-50)] rounded-lg">
      <DollarSign className="w-5 h-5 text-[var(--brand-primary-700)]" />
      <div>
        <p className="text-xs text-[var(--brand-text-secondary)]">Valor da Causa</p>
        <p className="font-semibold text-[var(--brand-text-primary)]">{formatValor(valor)}</p>
      </div>
    </div>
  );
}