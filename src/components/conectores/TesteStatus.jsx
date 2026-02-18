import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function TesteStatus({ status, tempoMs }) {
  const config = {
    SUCESSO: { icon: CheckCircle2, variant: 'default', text: 'Sucesso', color: 'text-[var(--brand-success)]' },
    ERRO: { icon: XCircle, variant: 'destructive', text: 'Erro', color: 'text-[var(--brand-error)]' },
    TIMEOUT: { icon: Clock, variant: 'secondary', text: 'Timeout', color: 'text-[var(--brand-warning)]' }
  }[status] || { icon: Clock, variant: 'outline', text: status };

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
      {tempoMs && (
        <span className="text-sm text-[var(--text-secondary)]">{tempoMs}ms</span>
      )}
    </div>
  );
}