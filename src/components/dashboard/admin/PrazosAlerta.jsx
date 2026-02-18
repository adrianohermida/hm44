import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrazosAlerta({ escritorioId }) {
  const navigate = useNavigate();

  const { data: prazos = [], isLoading } = useQuery({
    queryKey: ['prazos-alerta', escritorioId],
    queryFn: async () => {
      const all = await base44.entities.Prazo.filter({
        escritorio_id: escritorioId,
        status: { $in: ['pendente', 'em_andamento'] },
      }, 'data_vencimento', 10);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return all.filter(p => {
        const d = new Date(p.data_vencimento);
        d.setHours(0, 0, 0, 0);
        return Math.floor((d - hoje) / 86400000) <= 7;
      });
    },
    enabled: !!escritorioId,
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base text-[var(--text-primary)] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Prazos Críticos
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => navigate(createPageUrl('Prazos'))}>
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)
        ) : prazos.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2 opacity-40" />
            <p className="text-sm text-[var(--text-secondary)]">Nenhum prazo crítico</p>
          </div>
        ) : (
          prazos.map(p => {
            const d = new Date(p.data_vencimento);
            d.setHours(0, 0, 0, 0);
            const days = Math.floor((d - hoje) / 86400000);
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate font-medium">{p.titulo}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {new Date(p.data_vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge className={
                  days < 0 ? 'bg-red-100 text-red-700' :
                  days === 0 ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }>
                  {days < 0 ? `${Math.abs(days)}d atraso` : days === 0 ? 'Hoje' : `${days}d`}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}