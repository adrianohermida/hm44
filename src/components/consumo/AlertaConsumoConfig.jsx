import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AlertaConsumoConfig({ config }) {
  const [percentual, setPercentual] = useState(config?.alertar_em_percentual || 80);

  const salvar = async () => {
    try {
      await base44.entities.ConfiguracaoEscavador.update(config.id, {
        alertar_em_percentual: percentual
      });
      toast.success('Configuração salva');
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Alertas de Consumo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-sm text-[var(--text-secondary)]">Alertar em</label>
          <Input type="number" value={percentual} onChange={(e) => setPercentual(e.target.value)} />
        </div>
        <Button onClick={salvar} className="w-full">Salvar</Button>
      </CardContent>
    </Card>
  );
}