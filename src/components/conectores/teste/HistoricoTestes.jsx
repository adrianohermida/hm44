import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import TesteStatus from '../TesteStatus';
import EmptyState from '@/components/common/EmptyState';

export default function HistoricoTestes({ testes, onSelect }) {
  if (!testes?.length) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="Nenhum teste realizado"
            description="Execute testes para visualizar o histórico"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Testes ({testes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testes.map(teste => (
            <button
              key={teste.id}
              onClick={() => onSelect?.(teste)}
              className="w-full p-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)] transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <TesteStatus status={teste.status} tempoMs={teste.tempo_ms || teste.tempo_resposta_ms} />
                <span className="text-xs text-[var(--text-secondary)]">
                  {format(new Date(teste.created_date), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span>{teste.executado_por || teste.usuario_email}</span>
                {teste.http_status && (
                  <>
                    <span>•</span>
                    <span>HTTP {teste.http_status}</span>
                  </>
                )}
                {(teste.tempo_ms || teste.tempo_resposta_ms) && (
                  <>
                    <span>•</span>
                    <span>{teste.tempo_ms || teste.tempo_resposta_ms}ms</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}