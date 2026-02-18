import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, DollarSign, Activity, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import LoadingState from '@/components/common/LoadingState';

export default function ConsumoHistoricoProvedor({ provedorId, escritorioId }) {
  const [periodo, setPeriodo] = useState('7');

  const { data: consumos = [], isLoading } = useQuery({
    queryKey: ['consumo-historico', provedorId, periodo],
    queryFn: async () => {
      if (!escritorioId) return [];
      
      const diasAtras = new Date();
      diasAtras.setDate(diasAtras.getDate() - parseInt(periodo));
      const dataInicio = diasAtras.toISOString();

      const result = await base44.entities.ConsumoAPIExterna.filter({ 
        provedor_id: provedorId,
        escritorio_id: escritorioId,
        created_date: { $gte: dataInicio }
      });
      
      return result.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );
    },
    enabled: !!provedorId && !!escritorioId
  });

  if (isLoading) return <LoadingState message="Carregando histórico..." />;

  const totalCreditos = consumos.reduce((sum, c) => sum + (c.creditos_consumidos || 0), 0);
  const taxaSucesso = consumos.length > 0 
    ? ((consumos.filter(c => c.sucesso).length / consumos.length) * 100).toFixed(1)
    : 0;
  const tempoMedio = consumos.length > 0
    ? Math.round(consumos.reduce((sum, c) => sum + (c.tempo_ms || 0), 0) / consumos.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Histórico de Consumo</h3>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="15">15 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
            <SelectItem value="90">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalCreditos}</div>
            <p className="text-xs text-[var(--text-tertiary)]">{consumos.length} chamadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Taxa Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{taxaSucesso}%</div>
            <p className="text-xs text-[var(--text-tertiary)]">
              {consumos.filter(c => c.sucesso).length} sucessos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{tempoMedio}ms</div>
            <p className="text-xs text-[var(--text-tertiary)]">por chamada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Chamadas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {consumos.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--text-tertiary)]">
              Nenhuma chamada registrada no período
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-[var(--border-primary)]">
                {consumos.map((consumo) => (
                  <div key={consumo.id} className="p-3 hover:bg-[var(--bg-secondary)] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {consumo.sucesso ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {consumo.operacao || 'Consulta'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(consumo.created_date), 'dd/MM/yyyy HH:mm')}
                        </div>

                        {consumo.parametros && (
                          <div className="mt-1 text-xs">
                            <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[10px]">
                              {JSON.stringify(consumo.parametros).substring(0, 50)}...
                            </code>
                          </div>
                        )}

                        {consumo.executado_por && (
                          <div className="mt-1 text-xs text-[var(--text-tertiary)]">
                            por {consumo.executado_por}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge variant={consumo.sucesso ? "default" : "destructive"} className="text-xs">
                          {consumo.http_status || 'N/A'}
                        </Badge>
                        <div className="text-xs font-medium">
                          {consumo.creditos_consumidos || 0} créditos
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)]">
                          {consumo.tempo_ms || 0}ms
                        </div>
                      </div>
                    </div>

                    {!consumo.sucesso && consumo.erro && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                        {consumo.erro}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}