import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function HealthCheckTrigger({ provedorId, onComplete }) {
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('testarProvedorHealth', {
        provedor_id: provedorId
      });
      toast.success(`Status: ${data.status}`);
      onComplete?.(data);
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={check} disabled={loading} size="sm" variant="outline">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
    </Button>
  );
}