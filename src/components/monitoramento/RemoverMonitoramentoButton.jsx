import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RemoverMonitoramentoButton({ monitoramento, onRemoved }) {
  const [loading, setLoading] = useState(false);

  const remover = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('removerMonitoramento', {
        monitoramento_id_externo: monitoramento.monitoramento_id_externo,
        tipo: monitoramento.tipo
      });
      toast.success('Removido!');
      onRemoved?.();
    } catch {
      toast.error('Erro ao remover');
    }
    setLoading(false);
  };

  return (
    <Button variant="ghost" size="sm" onClick={remover} disabled={loading}>
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}