import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SLAConfigManager() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: slas = [] } = useQuery({
    queryKey: ['tickets-sla', escritorio?.id],
    queryFn: async () => {
      const tickets = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorio.id,
        status: { $in: ['aberto', 'em_atendimento'] }
      });
      
      const slaPromises = tickets.map(async (ticket) => {
        const [sla] = await base44.entities.TicketSLA.filter({ ticket_id: ticket.id });
        return { ticket, sla };
      });
      
      return Promise.all(slaPromises);
    },
    enabled: !!escritorio
  });

  const violacoes = slas.filter(s => s.sla?.violou_sla_resposta || s.sla?.violou_sla_resolucao);
  const emDia = slas.filter(s => s.sla && !s.sla.violou_sla_resposta && !s.sla.violou_sla_resolucao);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Tickets SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-3xl font-bold">{slas.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Violações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <span className="text-3xl font-bold text-red-600">{violacoes.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Em Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{emDia.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}