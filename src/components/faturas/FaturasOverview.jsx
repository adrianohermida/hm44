import React from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function FaturasOverview({ honorarios }) {
  const total = honorarios.reduce((acc, h) => acc + (h.valor_total || 0), 0);
  const pago = honorarios.reduce((acc, h) => acc + (h.valor_pago || 0), 0);
  const pendente = total - pago;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="p-6 bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-[var(--brand-primary)]" />
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-[var(--brand-success)]" />
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Pago</p>
            <p className="text-2xl font-bold text-[var(--brand-success)]">
              R$ {pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-[var(--brand-warning)]" />
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Pendente</p>
            <p className="text-2xl font-bold text-[var(--brand-warning)]">
              R$ {pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}