import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const statusIcons = {
  'Sucesso': CheckCircle,
  'Erro': XCircle,
  'Em tentativa': Clock
};

export default function CallbackLogItem({ callback }) {
  const Icon = statusIcons[callback.status] || Clock;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">{callback.evento}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {new Date(callback.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge variant={callback.processado ? 'default' : 'outline'}>
            {callback.processado ? 'Processado' : 'Pendente'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}