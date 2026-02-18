import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Bell, Clock } from 'lucide-react';
import moment from 'moment';

export default function DatajudAutomation({ darkMode = false }) {
  const { data: monitoramentos = [] } = useQuery({
    queryKey: ['monitoramentos-ativos'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      if (!escritorios[0]) return [];
      return base44.entities.MonitoramentoDatajud.filter({
        escritorio_id: escritorios[0].id,
        ativo: true
      }, '-proxima_verificacao', 50);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Monitoramentos Ativos
        </CardTitle>
        <CardDescription>
          {monitoramentos.length} processos sendo monitorados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monitoramentos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum processo monitorado</p>
            <p className="text-xs mt-1">Ative o monitoramento na aba Sincronização</p>
          </div>
        ) : (
          <div className="space-y-2">
            {monitoramentos.map(mon => (
              <div key={mon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{mon.numero_cnj}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Próxima: {moment(mon.proxima_verificacao).format('DD/MM HH:mm')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {mon.movimentos_encontrados || 0} movimentos
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}