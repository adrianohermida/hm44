import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import moment from 'moment';

export default function AlertHistoryList({ alertas }) {
  const icons = {
    CRITICAL: XCircle,
    WARNING: AlertTriangle,
    INFO: Info
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {alertas.map((alerta, i) => {
        const Icon = icons[alerta.severidade];
        return (
          <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <Badge variant={alerta.severidade === 'CRITICAL' ? 'destructive' : 'default'}>
                <Icon className="w-3 h-3 mr-1" /> {alerta.tipo_alerta}
              </Badge>
              <span className="text-xs text-[var(--text-secondary)]">
                {moment(alerta.created_date).fromNow()}
              </span>
            </div>
            <p className="text-sm">{alerta.mensagem}</p>
          </div>
        );
      })}
    </div>
  );
}