import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff } from 'lucide-react';

export default function MonitoramentosProcessoLista() {
  const { data: monitoramentos = [] } = useQuery({
    queryKey: ['monitoramentos-processo'],
    queryFn: () => base44.entities.MonitoramentoEscavador.filter({ tipo: 'PROCESSO' })
  });

  return (
    <div className="space-y-3">
      {monitoramentos.map(m => (
        <Card key={m.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {m.ativo ? <Bell className="w-5 h-5 text-green-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
              <div>
                <p className="font-medium">{m.termo}</p>
                <p className="text-xs text-[var(--text-secondary)]">{m.descricao}</p>
              </div>
            </div>
            <Badge>{m.aparicoes_nao_visualizadas || 0} novas</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}