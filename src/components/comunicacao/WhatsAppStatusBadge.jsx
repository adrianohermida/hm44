import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  enviando: { icon: Clock, color: 'text-gray-400', label: 'Enviando' },
  enviado: { icon: Check, color: 'text-gray-500', label: 'Enviado' },
  entregue: { icon: CheckCheck, color: 'text-blue-500', label: 'Entregue' },
  lido: { icon: CheckCheck, color: 'text-green-500', label: 'Lido' },
  falha: { icon: AlertCircle, color: 'text-red-500', label: 'Falha' }
};

export default function WhatsAppStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.enviando;
  const Icon = config.icon;
  
  return (
    <div className="flex items-center gap-1 text-xs">
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}