import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function LogsSincronizacao({ escritorioId }) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['logs-datajud', escritorioId],
    queryFn: async () => {
      if (!escritorioId) return [];
      
      // Buscar últimas execuções do cron
      const execucoes = await base44.entities.CronExecution.filter({
        cron_name: 'cronSincronizacaoDatajud'
      }, '-created_date', 50);
      
      return execucoes;
    },
    enabled: !!escritorioId,
    refetchInterval: 30000
  });

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Sincronização</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum log encontrado</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(log.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm:ss')}
                        </span>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                      
                      {log.result?.sincronizados !== undefined && (
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>✅ Sincronizados: {log.result.sincronizados}</div>
                          <div>⏳ Pendentes: {log.result.total - log.result.sincronizados}</div>
                          {log.result.erros > 0 && (
                            <div>❌ Erros: {log.result.erros}</div>
                          )}
                          {log.result.nao_encontrados > 0 && (
                            <div>⚠️ Não encontrados: {log.result.nao_encontrados}</div>
                          )}
                        </div>
                      )}

                      {log.error && (
                        <div className="text-xs text-red-600 mt-1 font-mono">
                          {log.error}
                        </div>
                      )}

                      {log.duration_ms && (
                        <div className="text-xs text-gray-500 mt-1">
                          Duração: {log.duration_ms}ms
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}