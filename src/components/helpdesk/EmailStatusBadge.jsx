import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, Eye, MousePointer, AlertCircle, Clock } from 'lucide-react';

const statusConfig = {
  enviando: {
    label: 'Enviando',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock
  },
  entregue: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2
  },
  aberto: {
    label: 'Aberto',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Eye
  },
  clicado: {
    label: 'Clicado',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: MousePointer
  },
  bounce: {
    label: 'Bounce',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: AlertCircle
  },
  spam: {
    label: 'Spam',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle
  },
  erro: {
    label: 'Erro',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle
  }
};

export default function EmailStatusBadge({ status, showIcon = true, className = '' }) {
  const config = statusConfig[status] || statusConfig.enviando;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className} gap-1`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}