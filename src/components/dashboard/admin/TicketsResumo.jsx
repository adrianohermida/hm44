import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TicketsResumo({ escritorioId }) {
  const navigate = useNavigate();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets-resumo', escritorioId],
    queryFn: () => base44.entities.Ticket.filter(
      { escritorio_id: escritorioId, status: { $in: ['aberto', 'em_atendimento'] } },
      '-created_date', 6
    ),
    enabled: !!escritorioId,
  });

  const prioridadeCores = {
    urgente: 'bg-red-100 text-red-700',
    alta: 'bg-orange-100 text-orange-700',
    media: 'bg-yellow-100 text-yellow-700',
    baixa: 'bg-green-100 text-green-700',
  };

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base text-[var(--text-primary)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          Tickets Abertos ({tickets.length})
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => navigate(createPageUrl('Helpdesk'))}>
          Abrir Helpdesk
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)
        ) : tickets.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2 opacity-40" />
            <p className="text-sm text-[var(--text-secondary)]">Nenhum ticket aberto</p>
          </div>
        ) : (
          tickets.map(t => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
              onClick={() => navigate(`${createPageUrl('Helpdesk')}?ticket=${t.id}`)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate font-medium">{t.titulo}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {new Date(t.created_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Badge className={prioridadeCores[t.prioridade] || prioridadeCores.media}>
                {t.prioridade || 'média'}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}