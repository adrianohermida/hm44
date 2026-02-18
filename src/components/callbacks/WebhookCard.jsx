import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Copy, Eye, Power } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import WebhookRetryStatus from './WebhookRetryStatus';

export default function WebhookCard({ webhook, provedor, onEdit, onViewLogs }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (id) => base44.entities.WebhookConector.update(id, { ativo: !webhook.ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      toast.success(webhook.ativo ? 'Webhook desativado' : 'Webhook ativado');
    }
  });

  const copyUrl = () => {
    navigator.clipboard.writeText(webhook.url_webhook || 'URL será gerada');
    toast.success('URL copiada!');
  };

  const copyToken = () => {
    navigator.clipboard.writeText(webhook.token_validacao);
    toast.success('Token copiado!');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{webhook.nome}</h3>
            <Badge variant={webhook.ativo ? 'default' : 'secondary'}>
              {webhook.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            <WebhookRetryStatus webhook={webhook} />
          </div>
          {provedor && (
            <p className="text-sm text-[var(--text-secondary)]">
              Provedor: {provedor.nome}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => toggleMutation.mutate(webhook.id)}>
            <Power className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(webhook)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-[var(--text-secondary)]">URL Webhook</label>
          <div className="flex gap-2 mt-1">
            <code className="flex-1 text-xs bg-[var(--bg-secondary)] p-2 rounded">
              {webhook.url_webhook || 'Será gerado após salvar'}
            </code>
            <Button variant="outline" size="sm" onClick={copyUrl}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)]">Token de Validação</label>
          <div className="flex gap-2 mt-1">
            <code className="flex-1 text-xs bg-[var(--bg-secondary)] p-2 rounded">
              {webhook.token_validacao.substring(0, 20)}...
            </code>
            <Button variant="outline" size="sm" onClick={copyToken}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {webhook.eventos_suportados?.length > 0 && (
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Eventos</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {webhook.eventos_suportados.map(evento => (
                <Badge key={evento} variant="outline" className="text-xs">
                  {evento}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-[var(--text-secondary)]">
            {webhook.total_chamadas || 0} chamadas
            {webhook.ultima_chamada && ` • Última: ${new Date(webhook.ultima_chamada).toLocaleString()}`}
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewLogs(webhook)}>
            <Eye className="w-4 h-4 mr-2" />Ver Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}