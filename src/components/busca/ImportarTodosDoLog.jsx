import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { importarProcessoCompleto } from './ImportProcessoService';
import { base44 } from '@/api/base44Client';

export default function ImportarTodosDoLog({ log, onComplete }) {
  const [loading, setLoading] = useState(false);

  const importarTodos = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const escritorio = await base44.entities.Escritorio.filter({ created_by: user.email });
      const escritorioId = escritorio[0]?.id;

      const processos = log.resposta_completa?.fontes || [];
      let importados = 0;
      let totalPartes = 0;

      for (const p of processos) {
        const result = await importarProcessoCompleto(p, escritorioId, log.parametros?.oab);
        importados++;
        totalPartes += result.totalPartes;
      }

      toast.success(`${importados} processos e ${totalPartes} partes importadas do log`);
      if (onComplete) onComplete();
    } catch (err) {
      toast.error('Erro ao importar processos do log');
    } finally {
      setLoading(false);
    }
  };

  const totalProcessos = log?.resposta_completa?.fontes?.length || 0;

  return (
    <Button onClick={importarTodos} disabled={loading || totalProcessos === 0} size="sm" variant="outline" className="w-full">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
      Importar todos ({totalProcessos})
    </Button>
  );
}