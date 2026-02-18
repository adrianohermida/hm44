import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function AlertasList({ alertas }) {
  if (!alertas?.length) return null;

  const icons = {
    CRITICAL: AlertTriangle,
    WARNING: AlertCircle,
    INFO: Info
  };

  return (
    <div className="space-y-2">
      {alertas.map(a => {
        const Icon = icons[a.severidade] || Info;
        return (
          <Card key={a.id}>
            <CardContent className="pt-3">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-[var(--brand-error)] mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={a.severidade === 'CRITICAL' ? 'destructive' : 'secondary'}>
                      {a.tipo_alerta}
                    </Badge>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {format(new Date(a.created_date), 'dd/MM HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{a.mensagem}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}