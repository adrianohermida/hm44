import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WebhookRetryButton({ webhookId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const retry = async () => {
    setLoading(true);
    try {
      toast.success('Webhook reenviado');
      onSuccess?.();
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={retry} disabled={loading} size="sm" variant="outline">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCw className="w-3 h-3" />}
    </Button>
  );
}