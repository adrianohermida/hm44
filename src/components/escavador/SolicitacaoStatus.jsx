import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  'PENDENTE': { icon: Clock, variant: 'outline', label: 'Pendente' },
  'SUCESSO': { icon: CheckCircle, variant: 'default', label: 'Sucesso' },
  'NAO_ENCONTRADO': { icon: AlertCircle, variant: 'warning', label: 'Não encontrado' },
  'ERRO': { icon: XCircle, variant: 'destructive', label: 'Erro' }
};

export default function SolicitacaoStatus({ status }) {
  const config = statusConfig[status] || statusConfig.PENDENTE;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}