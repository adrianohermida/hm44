import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

export default function WebhookLogsModal({ webhook, onClose }) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['webhook-logs', webhook.id],
    queryFn: () => base44.entities.LogWebhook.filter({ webhook_id: webhook.id }, '-created_date', 50)
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Logs - {webhook.nome}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState message="Carregando logs..." />
          ) : logs.length === 0 ? (
            <EmptyState title="Nenhum log encontrado" description="Ainda não houve chamadas para este webhook" />
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="border rounded-lg p-4 bg-[var(--bg-secondary)]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {log.sucesso ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">{log.evento}</span>
                      <Badge variant={log.validado ? 'default' : 'destructive'}>
                        {log.validado ? 'Validado' : 'Não validado'}
                      </Badge>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_date).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)]">Status:</span>
                      <span className="ml-2 font-medium">{log.status_code}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">Tempo:</span>
                      <span className="ml-2 font-medium">{log.tempo_resposta_ms}ms</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">IP:</span>
                      <span className="ml-2 font-medium">{log.ip_origem}</span>
                    </div>
                  </div>

                  {log.erro_mensagem && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                      {log.erro_mensagem}
                    </div>
                  )}

                  {log.payload && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-[var(--brand-primary)] hover:underline">
                        Ver Payload
                      </summary>
                      <pre className="mt-2 p-2 bg-[var(--bg-primary)] rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}