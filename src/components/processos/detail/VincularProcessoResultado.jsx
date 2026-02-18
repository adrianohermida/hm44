import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import TipoVinculoSelector from './TipoVinculoSelector';

export default function VincularProcessoResultado({ processo, onVincular, loading }) {
  const [tipoVinculo, setTipoVinculo] = useState('apenso');

  const handleVincular = () => {
    onVincular({
      processo_pai_id: processo.id,
      relation_type: tipoVinculo
    });
  };

  return (
    <div className="space-y-3 border-t pt-3">
      <div className="text-sm">
        <p className="font-medium text-[var(--text-primary)]">{processo.titulo}</p>
        <p className="text-[var(--text-secondary)]">{processo.numero_cnj}</p>
      </div>

      <TipoVinculoSelector value={tipoVinculo} onChange={setTipoVinculo} />

      <Button onClick={handleVincular} disabled={loading} className="w-full">
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Vincular
      </Button>
    </div>
  );
}