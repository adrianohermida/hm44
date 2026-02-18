import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function MonitoramentoProcessoForm({ onSuccess }) {
  const [cnj, setCnj] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.functions.invoke('criarMonitoramentoProcesso', { numero_cnj: cnj });
      toast.success('Monitoramento criado');
      setCnj('');
      onSuccess?.();
    } catch (error) {
      toast.error('Erro ao criar monitoramento');
    }
    setLoading(false);
  };

  return (
    <Card className="border-[var(--border-primary)]">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-[var(--text-secondary)]">Número CNJ</Label>
            <Input 
              value={cnj} 
              onChange={(e) => setCnj(e.target.value)} 
              placeholder="0000000-00.0000.0.00.0000"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-primary)]">
            {loading ? 'Criando...' : 'Criar Monitoramento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}