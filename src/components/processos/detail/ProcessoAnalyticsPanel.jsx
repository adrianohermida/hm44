import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function ProcessoAnalyticsPanel({ processo, open, onClose }) {
  const { data: consumos = [], isLoading } = useQuery({
    queryKey: ['consumo-api-analytics', processo?.id],
    queryFn: async () => {
      if (!processo?.numero_cnj) return [];
      
      const consumosData = await base44.entities.ConsumoAPIExterna.filter({
        'parametros.numero_cnj': processo.numero_cnj
      });
      
      const consumosEnriquecidos = await Promise.all(
        consumosData.map(async (c) => {
          const endpoint = c.endpoint_id 
            ? await base44.entities.EndpointAPI.filter({ id: c.endpoint_id }).then(r => r[0])
            : null;
          const provedor = c.provedor_id
            ? await base44.entities.ProvedorAPI.filter({ id: c.provedor_id }).then(r => r[0])
            : null;
          
          return {
            ...c,
            endpoint_nome: endpoint?.nome || 'Desconhecido',
            provedor_nome: provedor?.nome || 'Desconhecido'
          };
        })
      );
      
      return consumosEnriquecidos.sort((a, b) => 
        new Date(b.created_date) - new Date(a.created_date)
      );
    },
    enabled: open && !!processo?.numero_cnj
  });

  const totalConsultas = consumos.length;
  const custoTotal = consumos.reduce((sum, c) => sum + (c.custo_estimado || 0), 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Analytics do Processo</SheetTitle>
          <SheetDescription>
            Consumo de API e histórico de {processo?.numero_cnj}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Total de Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalConsultas}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Custo Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-[var(--text-tertiary)]">Carregando...</p>
              ) : consumos.length === 0 ? (
                <p className="text-sm text-[var(--text-tertiary)]">Nenhuma consulta registrada</p>
              ) : (
                <div className="space-y-3">
                  {consumos.map((consumo) => (
                    <div key={consumo.id} className="border-l-2 border-[var(--brand-primary)] pl-3 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-medium text-sm">{consumo.provedor_nome}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{consumo.endpoint_nome}</p>
                        </div>
                        <span className="text-sm font-semibold text-[var(--brand-primary)]">
                          R$ {(consumo.custo_estimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                        <span>{format(new Date(consumo.created_date), 'dd/MM/yyyy HH:mm')}</span>
                        <span>{consumo.sucesso ? '✓ Sucesso' : '✗ Erro'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}