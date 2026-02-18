import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HistoricoTestesDatajud({ escritorioId }) {
  const { data: testes = [] } = useQuery({
    queryKey: ['testes-datajud', escritorioId],
    queryFn: () => base44.entities.TesteEndpoint.filter(
      { escritorio_id: escritorioId, provedor_id: 'datajud' },
      '-created_date',
      50
    ),
    enabled: !!escritorioId
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📋 Histórico de Testes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {testes.map((teste) => (
              <div key={teste.id} className="border rounded-lg p-3 text-xs">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {teste.sucesso ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-mono font-semibold">{teste.endpoint_nome}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {teste.latencia_ms}ms
                  </Badge>
                </div>
                
                {teste.parametros_enviados?.numeroProcesso && (
                  <p className="text-gray-600 mb-1">
                    CNJ: {teste.parametros_enviados.numeroProcesso}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(teste.created_date).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
            
            {testes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">
                Nenhum teste realizado ainda
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}