import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MonitoramentoTribunalCard({ monitor }) {
  const statusIcons = {
    FOUND: CheckCircle,
    NOT_FOUND: XCircle,
    SENHA_INVALIDA: AlertCircle
  };
  
  const Icon = statusIcons[monitor.status] || Activity;
  const statusColors = {
    FOUND: 'text-green-600',
    NOT_FOUND: 'text-red-600',
    SENHA_INVALIDA: 'text-yellow-600'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-mono text-sm font-semibold text-[var(--brand-text-primary)]">
              {monitor.valor}
            </p>
            <p className="text-xs text-[var(--brand-text-secondary)]">{monitor.origem}</p>
          </div>
          <Icon className={`w-5 h-5 ${statusColors[monitor.status]}`} />
        </div>
        <Badge variant="outline" className="text-xs">{monitor.frequencia}</Badge>
      </CardContent>
    </Card>
  );
}