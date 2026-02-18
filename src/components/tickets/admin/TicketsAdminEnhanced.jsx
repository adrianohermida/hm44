import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Plus, RefreshCw } from 'lucide-react';
import TicketDetailAdmin from './TicketDetailAdmin';
import EmailComposerModal from '@/components/comunicacao/EmailComposerModal';
import EmailBadge from '@/components/comunicacao/EmailBadge';
import TicketFilters from './TicketFilters';
import TicketAssignment from './TicketAssignment';
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

export default function TicketsAdminEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todos');
  const [responsavelFilter, setResponsavelFilter] = useState('todos');
  const [spamFilter, setSpamFilter] = useState('inbox');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['tickets-admin', statusFilter, prioridadeFilter, responsavelFilter, spamFilter],
    queryFn: async () => {
      const user = await base44.auth.me();
      const escritorios = await base44.entities.Escritorio.list();
      const escritorioId = escritorios[0]?.id;

      let query = { escritorio_id: escritorioId };
      
      if (spamFilter === 'spam') query.is_spam = true;
      if (spamFilter === 'inbox') query.is_spam = { $ne: true };
      if (statusFilter !== 'todos') query.status = statusFilter;
      if (prioridadeFilter !== 'todos') query.prioridade = prioridadeFilter;
      
      if (responsavelFilter === 'meus') query.responsavel_email = user.email;
      if (responsavelFilter === 'ia') query.responsavel_email = 'ia@sistema';
      if (responsavelFilter === 'sem_atribuir') query.responsavel_email = null;

      return base44.entities.Ticket.filter(query, '-updated_date', 100);
    },
    refetchInterval: 5000
  });

  const ticketsFiltrados = tickets.filter(ticket =>
    ticket.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.cliente_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-4">
      <div className="md:w-80 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={() => setEmailModalOpen(true)} className="bg-[var(--brand-primary)]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <TicketFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          prioridadeFilter={prioridadeFilter}
          onPrioridadeChange={setPrioridadeFilter}
          responsavelFilter={responsavelFilter}
          onResponsavelChange={setResponsavelFilter}
          spamFilter={spamFilter}
          onSpamChange={setSpamFilter}
        />

        <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : ticketsFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-600">Nenhum ticket encontrado</p>
              </CardContent>
            </Card>
          ) : (
            ticketsFiltrados.map(ticket => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTicketId === ticket.id ? 'border-[var(--brand-primary)] shadow-md' : ''
                }`}
                onClick={() => setSelectedTicketId(ticket.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-sm truncate flex-1">{ticket.titulo}</h3>
                    <div className="flex items-center gap-1">
                      {ticket.canal === 'email' && <EmailBadge />}
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {ticket.cliente_email || ticket.cliente_nome}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {format(new Date(ticket.updated_date || ticket.created_date), 'dd/MM HH:mm', { locale: ptBR })}
                    </span>
                    {ticket.responsavel_email === 'ia@sistema' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">🤖 IA</span>
                    )}
                  </div>
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
              <p className="text-gray-600">Selecione um ticket</p>
            </CardContent>
          </Card>
        )}
      </div>

      <EmailComposerModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
    </div>
  );
}