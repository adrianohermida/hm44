import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function MonitoramentoV2Card({ monitor }) {
  const statusConfig = {
    PENDENTE: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    ENCONTRADO: { icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    NAO_ENCONTRADO: { icon: XCircle, color: 'bg-red-100 text-red-800' }
  };

  const { icon: Icon, color } = statusConfig[monitor.status] || statusConfig.PENDENTE;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="font-mono text-sm font-semibold">{monitor.numero}</p>
          <Badge className={color}>
            <Icon className="w-3 h-3 mr-1" />
            {monitor.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{monitor.frequencia}</Badge>
          {monitor.tribunais?.map((t, i) => (
            <Badge key={i} variant="outline" className="text-xs">{t.sigla}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}