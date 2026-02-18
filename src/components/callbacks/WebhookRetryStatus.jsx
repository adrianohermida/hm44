import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function WebhookRetryStatus({ webhook }) {
  const isRetrying = webhook.retry_config?.attempts > 0;
  
  if (!isRetrying) {
    return <Badge variant="default"><CheckCircle2 className="w-3 h-3 mr-1" />OK</Badge>;
  }

  const maxAttempts = webhook.retry_config?.max_tentativas || 3;
  const currentAttempts = webhook.retry_config?.attempts || 0;

  if (currentAttempts >= maxAttempts) {
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
  }

  return (
    <Badge variant="secondary">
      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
      Tentando {currentAttempts}/{maxAttempts}
    </Badge>
  );
}