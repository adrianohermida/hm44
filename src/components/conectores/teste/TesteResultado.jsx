import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function TesteResultado({ resultado }) {
  if (!resultado) return null;

  const isSucesso = resultado.status === 'SUCESSO' || resultado.sucesso;

  return (
    <Card className={isSucesso ? 'border-green-500/50' : 'border-red-500/50'}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-4">
          <Badge className={isSucesso ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
            {isSucesso ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {isSucesso ? 'SUCESSO' : 'ERRO'}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <Clock className="w-3 h-3" />
            {resultado.tempo_resposta_ms || resultado.latencia}ms
          </div>
        </div>

        {resultado.erro_mensagem && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 font-mono">{resultado.erro_mensagem}</p>
          </div>
        )}

        {resultado.resposta_recebida && (
          <div className="mt-3">
            <p className="text-xs text-[var(--text-tertiary)] mb-2">Resposta:</p>
            <pre className="text-xs p-3 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] overflow-x-auto">
              {JSON.stringify(resultado.resposta_recebida, null, 2)}
            </pre>
          </div>
        )}

        {resultado.http_status && (
          <p className="text-xs text-[var(--text-tertiary)] mt-3">
            HTTP Status: <span className="font-semibold text-[var(--text-primary)]">{resultado.http_status}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}