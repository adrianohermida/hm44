import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function QuotaMonitorCard({ provedor_id, escritorio_id }) {
  const { data: monitors = [], isLoading } = useQuery({
    queryKey: ['quota-monitors', provedor_id, escritorio_id],
    queryFn: () => base44.entities.QuotaMonitor.filter({
      escritorio_id,
      provedor_id
    }),
    refetchInterval: 60000 // Atualizar a cada 1 minuto
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monitoramento de Quota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (monitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monitoramento de Quota</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[var(--text-tertiary)]">
            Nenhuma quota monitorada ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular totais
  const totalConsumido = monitors.reduce((sum, m) => sum + m.quota_consumida_hoje, 0);
  const totalLimite = monitors[0]?.limite_diario || 10000;
  const percentTotal = (totalConsumido / totalLimite) * 100;
  const algumBloqueado = monitors.some(m => m.bloqueado);
  const algumAlerta = monitors.some(m => m.alerta_ativo);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Quota Diária</CardTitle>
          <Badge variant={algumBloqueado ? 'destructive' : algumAlerta ? 'warning' : 'default'}>
            {algumBloqueado ? (
              <><XCircle className="w-3 h-3 mr-1" />Bloqueado</>
            ) : algumAlerta ? (
              <><AlertTriangle className="w-3 h-3 mr-1" />Alerta</>
            ) : (
              <><CheckCircle2 className="w-3 h-3 mr-1" />Normal</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">Total Consumido</span>
            <span className="font-mono font-semibold">
              {totalConsumido.toLocaleString()} / {totalLimite.toLocaleString()}
            </span>
          </div>
          <Progress value={percentTotal} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-[var(--text-tertiary)]">
              {Math.round(percentTotal)}% usado
            </span>
            <span className="text-[var(--text-tertiary)]">
              {(totalLimite - totalConsumido).toLocaleString()} disponível
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <TrendingUp className="w-3 h-3" />
            <span>Por Recurso</span>
          </div>
          {monitors.slice(0, 5).map((monitor) => {
            const percent = (monitor.quota_consumida_hoje / monitor.limite_diario) * 100;
            return (
              <div key={monitor.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">
                    {monitor.recurso}.{monitor.metodo}
                  </span>
                  <span className="font-mono text-[10px]">
                    {monitor.quota_consumida_hoje} ({monitor.total_chamadas_hoje}x)
                  </span>
                </div>
                <Progress value={percent} className="h-1" />
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-[var(--text-tertiary)] pt-2 border-t">
          Reset diário: Meia-noite PT (Horário do Pacífico)
        </div>
      </CardContent>
    </Card>
  );
}