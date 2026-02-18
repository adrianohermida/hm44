import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SalvarSchemaButton({ endpointId, schema }) {
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    setLoading(true);
    try {
      await base44.entities.EndpointAPI.update(endpointId, {
        schema_resposta: schema
      });
      toast.success('Schema salvo');
    } catch (err) {
      toast.error('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={salvar} disabled={loading || !schema} variant="outline">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
      Salvar Schema
    </Button>
  );
}