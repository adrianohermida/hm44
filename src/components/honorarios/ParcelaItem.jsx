import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const statusIcons = {
  pago: { icon: CheckCircle, color: 'text-[var(--brand-success)]' },
  pendente: { icon: Clock, color: 'text-[var(--brand-warning)]' },
  vencido: { icon: AlertCircle, color: 'text-[var(--brand-error)]' }
};

export default function ParcelaItem({ parcela, index }) {
  const StatusIcon = statusIcons[parcela.status]?.icon || Clock;
  const iconColor = statusIcons[parcela.status]?.color || 'text-[var(--text-tertiary)]';

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center gap-3">
        <StatusIcon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <p className="font-medium text-[var(--text-primary)]">Parcela {parcela.numero}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Venc: {parcela.vencimento && format(new Date(parcela.vencimento), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>
      <p className="font-semibold text-[var(--text-primary)]">
        R$ {parcela.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}