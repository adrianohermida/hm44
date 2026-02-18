import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RemoverMonitoramentoButton({ monitoramento }) {
  const [loading, setLoading] = useState(false);

  const remover = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('removerMonitoramento', {
        monitoramento_id: monitoramento.id,
        monitoramento_externo_id: monitoramento.monitoramento_id_externo
      });
      toast.success('Monitoramento removido');
    } catch {
      toast.error('Erro ao remover');
    }
    setLoading(false);
  };

  return (
    <Button variant="destructive" size="sm" onClick={remover} disabled={loading}>
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}