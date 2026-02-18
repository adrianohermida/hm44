import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import moment from 'moment';

export default function WebhookLogItem({ log }) {
  const icons = {
    sucesso: CheckCircle2,
    erro: XCircle,
    pendente: Clock
  };

  const Icon = icons[log.status];

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <Badge variant={log.status === 'sucesso' ? 'default' : 'destructive'}>
          <Icon className="w-3 h-3 mr-1" /> {log.status}
        </Badge>
        <span className="text-xs text-[var(--text-secondary)]">
          {moment(log.created_date).fromNow()}
        </span>
      </div>
      <p className="text-sm">{log.evento}</p>
    </div>
  );
}