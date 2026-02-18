import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import moment from 'moment';

export default function HealthHistory({ provedorId }) {
  const { data: testes = [], isLoading } = useQuery({
    queryKey: ['testes-health', provedorId],
    queryFn: () => base44.entities.HistoricoSaudeProvedor.filter(
      { provedor_id: provedorId },
      '-created_date',
      10
    ),
    enabled: !!provedorId,
    staleTime: 1 * 60 * 1000
  });

  const latenciaMedia = React.useMemo(() => {
    if (testes.length === 0) return 0;
    return Math.round(testes.reduce((s, t) => s + (t.latencia_ms || 0), 0) / testes.length);
  }, [testes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
          <Clock className="w-5 h-5" /> Histórico Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            ))}
          </div>
        ) : testes.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-2">
              Nenhum teste de saúde registrado
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Execute um teste para monitorar a disponibilidade
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {testes.slice(0, 5).map((t, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-[var(--bg-secondary)]">
              <span className="text-[var(--text-secondary)]">{moment(t.created_date).format('DD/MM HH:mm')}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-primary)] font-mono">{t.latencia_ms}ms</span>
                {t.saude === 'Saudável' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </div>
            </div>
            ))}
          </div>
        )}
        {!isLoading && testes.length > 0 && (
          <p className="text-xs text-[var(--text-tertiary)] mt-4">Latência média: {latenciaMedia}ms</p>
        )}
      </CardContent>
    </Card>
  );
}