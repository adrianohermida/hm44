import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import LoadingState from '@/components/common/LoadingState';

export default function ConsumoAPICard({ clienteEmail }) {
  const { data: consumos = [], isLoading } = useQuery({
    queryKey: ['consumo-api', clienteEmail],
    queryFn: () => base44.entities.ConsumoAPIExterna.filter({ usuario_email: clienteEmail }),
    enabled: !!clienteEmail
  });

  if (isLoading) return <LoadingState />;

  if (consumos.length === 0) {
    return (
      <Card className="p-8 text-center bg-[var(--bg-secondary)]">
        <Activity className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
        <p className="text-[var(--text-secondary)]">Nenhuma consulta realizada</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {consumos.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {c.provedor} - {c.tipo_consulta}
                </span>
                {c.sucesso ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">{c.endpoint}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                  <span className="text-xs text-[var(--text-secondary)]">{c.tempo_resposta_ms}ms</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {new Date(c.created_date).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}