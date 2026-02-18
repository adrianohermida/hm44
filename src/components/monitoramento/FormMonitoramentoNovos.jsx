import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FormMonitoramentoNovos({ onSuccess }) {
  const [termo, setTermo] = useState('');
  const [loading, setLoading] = useState(false);

  const criar = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('criarMonitoramentoNovosProcessos', { termo });
      toast.success('Monitoramento criado!');
      onSuccess();
    } catch {
      toast.error('Erro ao criar');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Nome, CPF/CNPJ ou termo genérico" 
        value={termo} 
        onChange={(e) => setTermo(e.target.value)} 
      />
      <Button onClick={criar} disabled={loading || !termo} className="w-full">
        {loading ? 'Criando...' : 'Criar'}
      </Button>
    </div>
  );
}