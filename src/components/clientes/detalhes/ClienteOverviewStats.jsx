import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, File, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const StatCard = ({ icon: Icon, label, value, loading }) => (
  <div className="text-center">
    <div className="text-[var(--text-secondary)] text-sm mb-1">{label}</div>
    <div className="text-2xl font-bold text-[var(--text-primary)]">
      {loading ? '...' : value}
    </div>
  </div>
);

export default function ClienteOverviewStats({ clienteId, escritorioId }) {
  const { data: prontuarios = [], isLoading: loadingPront } = useQuery({
    queryKey: ['prontuarios-count', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Consulta.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      });
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  const { data: consultas = [], isLoading: loadingCons } = useQuery({
    queryKey: ['consultas-count', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Consulta.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      });
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  const { data: documentos = [], isLoading: loadingDocs } = useQuery({
    queryKey: ['documentos-count', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Documento.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      });
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  const { data: tickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ['tickets-count', clienteId],
    queryFn: async () => {
      const data = await base44.entities.Ticket.filter({
        cliente_id: clienteId,
        escritorio_id: escritorioId
      });
      return data;
    },
    enabled: !!clienteId && !!escritorioId
  });

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
          VISÃO GERAL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Processos"
            value={prontuarios.length}
            loading={loadingPront}
          />
          <StatCard
            label="Consultas"
            value={consultas.length}
            loading={loadingCons}
          />
          <StatCard
            label="Documentos"
            value={documentos.length}
            loading={loadingDocs}
          />
          <StatCard
            label="Tickets"
            value={tickets.length}
            loading={loadingTickets}
          />
        </div>
      </CardContent>
    </Card>
  );
}