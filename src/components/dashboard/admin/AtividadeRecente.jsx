import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, FileText, Calendar, DollarSign } from 'lucide-react';

function ActivityItem({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-primary)] truncate">{item.label}</p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <Badge variant="outline" className="text-xs flex-shrink-0">{item.badge}</Badge>
    </div>
  );
}

export default function AtividadeRecente({ escritorioId }) {
  const { data: tickets = [], isLoading: loadingT } = useQuery({
    queryKey: ['recentes-tickets', escritorioId],
    queryFn: () => base44.entities.Ticket.filter({ escritorio_id: escritorioId }, '-created_date', 5),
    enabled: !!escritorioId,
  });

  const { data: processos = [], isLoading: loadingP } = useQuery({
    queryKey: ['recentes-processos', escritorioId],
    queryFn: () => base44.entities.Processo.filter({ escritorio_id: escritorioId }, '-created_date', 5),
    enabled: !!escritorioId,
  });

  const isLoading = loadingT || loadingP;
  const items = [...tickets.map(t => ({
    id: t.id, tipo: 'ticket', label: t.titulo, date: t.created_date,
    badge: t.status, icon: MessageSquare, color: 'text-purple-500',
  })), ...processos.map(p => ({
    id: p.id, tipo: 'processo', label: p.titulo || p.numero_cnj, date: p.created_date,
    badge: p.status, icon: FileText, color: 'text-blue-500',
  }))].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardHeader>
        <CardTitle className="text-base text-[var(--text-primary)]">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-80 overflow-y-auto">
        {isLoading ? (
          [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded" />)
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-6">Nenhuma atividade</p>
        ) : (
          items.map(item => <ActivityItem key={item.id} item={item} />)
        )}
      </CardContent>
    </Card>
  );
}