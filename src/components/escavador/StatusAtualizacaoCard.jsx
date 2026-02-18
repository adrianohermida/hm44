import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

export default function StatusAtualizacaoCard({ status }) {
  const icon = status.tempo_desde_ultima_verificacao.includes('minutos') 
    ? <CheckCircle className="w-5 h-5 text-[var(--brand-success)]" />
    : <Clock className="w-5 h-5 text-[var(--brand-warning)]" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          Status de Atualização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Última verificação</span>
            <Badge>{status.tempo_desde_ultima_verificacao}</Badge>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            {new Date(status.data_ultima_verificacao).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}