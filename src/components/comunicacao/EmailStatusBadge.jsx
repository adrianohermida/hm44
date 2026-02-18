import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Mail, Eye, MousePointer, XCircle, Clock } from 'lucide-react';

export default function EmailStatusBadge({ mensagemId }) {
  const { data: status } = useQuery({
    queryKey: ['email-status', mensagemId],
    queryFn: () => base44.entities.EmailStatus.filter({ mensagem_id: mensagemId })
      .then(results => results[0]),
    enabled: !!mensagemId,
    refetchInterval: 10000
  });

  if (!status) return null;

  const statusConfig = {
    enviando: { icon: Clock, color: 'text-gray-500', label: 'Enviando...' },
    enviado: { icon: Mail, color: 'text-blue-500', label: 'Enviado' },
    entregue: { icon: CheckCircle, color: 'text-green-500', label: 'Entregue' },
    aberto: { icon: Eye, color: 'text-purple-500', label: 'Aberto' },
    clicado: { icon: MousePointer, color: 'text-indigo-500', label: 'Clicado' },
    bounce: { icon: XCircle, color: 'text-red-500', label: 'Bounce' },
    spam: { icon: XCircle, color: 'text-orange-500', label: 'Spam' },
    falha: { icon: XCircle, color: 'text-red-500', label: 'Falha' }
  };

  const config = statusConfig[status.status] || statusConfig.enviando;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1 text-xs" title={config.label}>
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}