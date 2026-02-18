import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { limparCNJ } from '@/components/utils/cnjUtils';

export default function SincronizarPartesButton({ processo, onComplete }) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!processo?.numero_cnj) {
      toast.error('Número CNJ não disponível');
      return;
    }

    setSyncing(true);
    try {
      const { data } = await base44.functions.invoke('syncProcessoDatajud', {
        processo_id: processo.id
      });

      if (data?.sucesso && data?.partes_salvas > 0) {
        toast.success(`${data.partes_salvas} partes sincronizadas do DataJud CNJ`);
        if (onComplete) onComplete();
      } else {
        toast.info('Nenhuma parte nova encontrada no DataJud');
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      toast.error('Erro ao buscar partes no CNJ');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={handleSync}
      disabled={syncing}
      title="Buscar partes do processo no CNJ (gratuito via DataJud)"
    >
      {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
      <span className="hidden sm:inline ml-2">
        {syncing ? 'Buscando...' : 'Buscar no CNJ'}
      </span>
    </Button>
  );
}