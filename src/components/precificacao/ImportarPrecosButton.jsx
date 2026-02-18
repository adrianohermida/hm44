import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ImportarPrecosButton({ escritorioId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const importar = async () => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke('importarPrecosEscavador', { 
        escritorio_id: escritorioId 
      });
      onSuccess(result.data.importados);
    } catch (error) {
      console.error('Erro ao importar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={importar} disabled={loading} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Importando...' : 'Importar Escavador'}
    </Button>
  );
}