import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, Plus, RefreshCw } from 'lucide-react';
import TicketDetailAdmin from './TicketDetailAdmin';
import EmailComposerModal from '@/components/comunicacao/EmailComposerModal';
import EmailBadge from '@/components/comunicacao/EmailBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatusBadge = ({ status }) => {
  const colors = {
    aberto: 'bg-blue-100 text-blue-700',
    em_atendimento: 'bg-yellow-100 text-yellow-700',
    aguardando_cliente: 'bg-orange-100 text-orange-700',
    resolvido: 'bg-green-100 text-green-700',
    fechado: 'bg-gray-100 text-gray-700'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.aberto}`}>
      {status}
    </span>
  );
};

export default function TicketsAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['tickets-admin', statusFilter],
    queryFn: async () => {
      const allTickets = await base44.entities.Ticket.list('-updated_date', 100);
      if (statusFilter === 'todos') return allTickets;
      return allTickets.filter(t => t.status === statusFilter);
    },
    refetchInterval: 5000 // Auto-refresh a cada 5 segundos
  });

  const ticketsFiltrados = tickets.filter(ticket =>
    ticket.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.cliente_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 p-4">
      <div className="md:w-1/3 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            title="Atualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            className="bg-[var(--brand-primary)]"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
            <SelectItem value="aguardando_cliente">Aguardando Cliente</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : ticketsFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {searchTerm ? 'Nenhum ticket encontrado' : 'Nenhum ticket disponível'}
                </p>
              </CardContent>
            </Card>
          ) : (
            ticketsFiltrados.map(ticket => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-colors hover:bg-[var(--bg-secondary)] ${
                  selectedTicketId === ticket.id ? 'bg-[var(--bg-secondary)] border-[var(--brand-primary)]' : ''
                }`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-sm text-[var(--text-primary)] truncate flex-1">
                      {ticket.titulo}
                    </h3>
                    <div className="flex items-center gap-1">
                      {ticket.canal === 'email' && <EmailBadge />}
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate mb-1">
                    {ticket.cliente_email || ticket.cliente_nome}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {format(new Date(ticket.updated_date || ticket.created_date), 'dd/MM/yy HH:mm', { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="flex-1">
        {selectedTicketId ? (
          <TicketDetailAdmin
            ticketId={selectedTicketId}
            onClose={() => setSelectedTicketId(null)}
            onUpdate={refetch}
          />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center p-8">
              <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-[var(--text-secondary)]">
                Selecione um ticket para visualizar
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <EmailComposerModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </div>
  );
}