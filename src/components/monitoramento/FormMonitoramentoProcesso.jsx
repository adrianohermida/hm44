import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FormMonitoramentoProcesso({ onSuccess }) {
  const [numero, setNumero] = useState('');
  const [frequencia, setFrequencia] = useState('DIARIA');
  const [loading, setLoading] = useState(false);

  const criar = async () => {
    setLoading(true);
    try {
      await base44.functions.invoke('criarMonitoramentoProcesso', { numero, frequencia });
      toast.success('Monitoramento criado!');
      onSuccess();
    } catch {
      toast.error('Erro ao criar');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Input placeholder="0000000-00.0000.0.00.0000" value={numero} onChange={(e) => setNumero(e.target.value)} />
      <Select value={frequencia} onValueChange={setFrequencia}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="DIARIA">Diária</SelectItem>
          <SelectItem value="SEMANAL">Semanal</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={criar} disabled={loading || !numero} className="w-full">
        {loading ? 'Criando...' : 'Criar'}
      </Button>
    </div>
  );
}