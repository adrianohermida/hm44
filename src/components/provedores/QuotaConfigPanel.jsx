import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Save, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function QuotaConfigPanel({ provedor }) {
  const [config, setConfig] = useState({
    limite_mensal: provedor?.quota_config?.limite_mensal || null,
    limite_diario: provedor?.quota_config?.limite_diario || null,
    alerta_threshold_percent: provedor?.quota_config?.alerta_threshold_percent || 80
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.ProvedorAPI.update(provedor.id, {
      quota_config: {
        ...provedor.quota_config,
        ...config
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['provedores']);
      toast.success('Configuração de quota salva');
    }
  });

  const resetMutation = useMutation({
    mutationFn: () => base44.entities.ProvedorAPI.update(provedor.id, {
      quota_config: {
        ...provedor.quota_config,
        consumo_dia_atual: 0,
        consumo_mes_atual: 0,
        quota_excedida: false,
        ultimo_reset_diario: new Date().toISOString().split('T')[0],
        ultimo_reset_mensal: new Date().toISOString().substring(0, 7)
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['provedores']);
      toast.success('Quota resetada');
    }
  });

  const consumoDiario = provedor?.quota_config?.consumo_dia_atual || 0;
  const consumoMensal = provedor?.quota_config?.consumo_mes_atual || 0;
  const limiteDiario = config.limite_diario || 0;
  const limiteMensal = config.limite_mensal || 0;

  const percentDiario = limiteDiario > 0 ? (consumoDiario / limiteDiario) * 100 : 0;
  const percentMensal = limiteMensal > 0 ? (consumoMensal / limiteMensal) * 100 : 0;

  const getProgressColor = (percent) => {
    if (percent >= 100) return 'bg-red-600';
    if (percent >= config.alerta_threshold_percent) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Configuração de Quota
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Limite Diário</Label>
            <Input
              type="number"
              value={config.limite_diario || ''}
              onChange={e => setConfig({...config, limite_diario: Number(e.target.value) || null})}
              placeholder="Sem limite"
            />
          </div>
          <div>
            <Label>Limite Mensal</Label>
            <Input
              type="number"
              value={config.limite_mensal || ''}
              onChange={e => setConfig({...config, limite_mensal: Number(e.target.value) || null})}
              placeholder="Sem limite"
            />
          </div>
        </div>

        <div>
          <Label>Alerta em (% do limite)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={config.alerta_threshold_percent}
            onChange={e => setConfig({...config, alerta_threshold_percent: Number(e.target.value)})}
          />
        </div>

        {(limiteDiario > 0 || limiteMensal > 0) && (
          <div className="space-y-3 pt-4 border-t">
            {limiteDiario > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Consumo Diário</span>
                  <Badge variant={percentDiario >= 100 ? 'destructive' : percentDiario >= config.alerta_threshold_percent ? 'secondary' : 'default'}>
                    {consumoDiario} / {limiteDiario}
                  </Badge>
                </div>
                <Progress value={Math.min(percentDiario, 100)} className={getProgressColor(percentDiario)} />
                {percentDiario >= config.alerta_threshold_percent && (
                  <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {percentDiario >= 100 ? 'Quota excedida!' : `Atingiu ${Math.round(percentDiario)}% do limite`}
                  </p>
                )}
              </div>
            )}

            {limiteMensal > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Consumo Mensal</span>
                  <Badge variant={percentMensal >= 100 ? 'destructive' : percentMensal >= config.alerta_threshold_percent ? 'secondary' : 'default'}>
                    {consumoMensal} / {limiteMensal}
                  </Badge>
                </div>
                <Progress value={Math.min(percentMensal, 100)} className={getProgressColor(percentMensal)} />
                {percentMensal >= config.alerta_threshold_percent && (
                  <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {percentMensal >= 100 ? 'Quota excedida!' : `Atingiu ${Math.round(percentMensal)}% do limite`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="outline" onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
            Resetar Quota
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}