import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function HealthTestButton({ provedor, onTestResult }) {
  const [testando, setTestando] = useState(false);

  const testar = async () => {
    if (!provedor?.id) {
      toast.error('Provedor inválido');
      return;
    }
    
    setTestando(true);
    try {
      const { data } = await base44.functions.invoke('testarProvedorHealth', {
        provedor_id: provedor.id
      });
      
      if (!data) {
        throw new Error('Resposta vazia da função');
      }
      
      toast.success(`Saúde: ${data.saude} (${data.latencia_ms}ms)`);
      onTestResult?.(data);
    } catch (err) {
      toast.error('Erro ao testar: ' + err.message);
      onTestResult?.({ erro: err.message, sucesso: false });
    } finally {
      setTestando(false);
    }
  };

  return (
    <Button onClick={testar} disabled={testando} className="w-full">
      {testando ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
      Testar Conexão
    </Button>
  );
}