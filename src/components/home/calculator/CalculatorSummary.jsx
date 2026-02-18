import React from 'react';
import { FileText, DollarSign, Calendar } from 'lucide-react';

export default function CalculatorSummary({ data }) {
  const items = [
    { icon: FileText, label: 'Tipo de Ação', value: data.tipoAcao },
    { icon: DollarSign, label: 'Valor Estimado', value: data.valorEstimado },
    { icon: Calendar, label: 'Prazo Estimado', value: data.prazoEstimado }
  ];

  return (
    <div className="bg-[var(--brand-bg-secondary)] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[var(--brand-text-primary)] mb-4">Resumo da Consulta</h3>
      <div className="space-y-4">
        {items.map(({ icon: Icon, label, value }, index) => (
          <div key={index} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-[var(--brand-primary)]" />
            <div>
              <p className="text-sm text-[var(--brand-text-secondary)]">{label}</p>
              <p className="font-medium text-[var(--brand-text-primary)]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}