import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

const STATUS_COLORS = {
  'Saudável': 'bg-green-100 text-green-800',
  'Degradado': 'bg-yellow-100 text-yellow-800',
  'Indisponível': 'bg-red-100 text-red-800'
};

export default function OptimizedHealthHistory({ historico = [] }) {
  const recentHistory = useMemo(() => 
    historico.slice(0, 10),
    [historico]
  );

  if (recentHistory.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Histórico Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]">
              <div className="flex items-center gap-2">
                <Badge className={STATUS_COLORS[item.saude]}>
                  {item.saude}
                </Badge>
                <span className="text-xs text-[var(--text-secondary)]">
                  {item.latencia_ms}ms
                </span>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">
                {format(new Date(item.created_date), 'dd/MM HH:mm')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}