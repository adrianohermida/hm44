import React from 'react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

const statusConfig = {
  novo: { icon: Clock, color: 'text-[var(--brand-info)]', bg: 'bg-blue-50', label: 'Novo' },
  aprovado: { icon: CheckCircle, color: 'text-[var(--brand-success)]', bg: 'bg-green-50', label: 'Aprovado' },
  rejeitado: { icon: XCircle, color: 'text-[var(--brand-error)]', bg: 'bg-red-50', label: 'Rejeitado' },
  agendado: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Agendado' }
};

export default function ConsultaStatus({ status }) {
  const config = statusConfig[status] || statusConfig.novo;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      {config.label}
    </span>
  );
}