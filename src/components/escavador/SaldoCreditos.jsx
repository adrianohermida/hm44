import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SaldoCreditos({ saldo, quantidadeCreditos }) {
  const saldoBaixo = quantidadeCreditos < 100;

  return (
    <div className={`p-3 rounded-lg ${saldoBaixo ? 'bg-yellow-50' : 'bg-[var(--brand-bg-secondary)]'}`}>
      <div className="flex items-center gap-2">
        <Wallet className={`w-5 h-5 ${saldoBaixo ? 'text-yellow-600' : 'text-[var(--brand-primary)]'}`} />
        <div className="flex-1">
          <p className="text-xs text-[var(--brand-text-secondary)]">Saldo API Escavador</p>
          <p className="font-bold text-[var(--brand-text-primary)]">{saldo}</p>
          <p className="text-xs text-[var(--brand-text-tertiary)]">{quantidadeCreditos} créditos</p>
        </div>
        {saldoBaixo && (
          <AlertCircle className="w-5 h-5 text-yellow-600" />
        )}
      </div>
    </div>
  );
}