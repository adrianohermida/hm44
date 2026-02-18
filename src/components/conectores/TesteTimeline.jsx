import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TesteStatus from './TesteStatus';
import { format } from 'date-fns';

export default function TesteTimeline({ testes }) {
  if (!testes?.length) return null;

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">Histórico</h3>
        <div className="space-y-3">
          {testes.map(t => (
            <div key={t.id} className="flex items-start justify-between pb-3 border-b border-[var(--border-primary)] last:border-0">
              <div>
                <TesteStatus status={t.status} tempoMs={t.tempo_resposta_ms} />
                <span className="text-xs text-[var(--text-tertiary)] mt-1 block">
                  {format(new Date(t.created_date), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">
                {t.usuario_email}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}