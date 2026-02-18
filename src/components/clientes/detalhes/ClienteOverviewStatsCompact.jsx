import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, File, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ClienteOverviewStatsCompact({ clienteId, escritorioId }) {
  const { data: processos = [] } = useQuery({
    queryKey: ['processos-cliente-count', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Processo.filter({ cliente_id: clienteId });
      return data;
    },
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ['documentos-count', clienteId],
    queryFn: async () => {
      return await base44.entities.Documento.filter({ cliente_id: clienteId });
    },
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets-count', clienteId],
    queryFn: async () => {
      return await base44.entities.Ticket.filter({ cliente_id: clienteId });
    },
    enabled: !!clienteId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
          Visão Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Processos</div>
            <div className="text-2xl font-bold text-[var(--brand-primary)]">{processos.length || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Tickets</div>
            <div className="text-2xl font-bold text-[var(--brand-primary)]">{tickets.length || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Documentos</div>
            <div className="text-2xl font-bold text-[var(--brand-primary)]">{documentos.length || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Partes</div>
            <div className="text-2xl font-bold text-[var(--brand-primary)]">-</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}