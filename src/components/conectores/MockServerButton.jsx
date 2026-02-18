import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function MockServerButton({ endpointId, onMockGenerated }) {
  const [loading, setLoading] = useState(false);

  const gerar = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('gerarMockResposta', {
        endpoint_id: endpointId
      });
      toast.success('Mock gerado');
      onMockGenerated(data.mock);
    } catch {
      toast.error('Erro ao gerar mock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={gerar} disabled={loading}>
      <Sparkles className="w-4 h-4 mr-2" />
      {loading ? 'Gerando...' : 'Gerar Mock'}
    </Button>
  );
}