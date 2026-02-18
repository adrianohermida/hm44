import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function TicketHistoryItem({ ticket, onClick }) {
  const statusColor = {
    aberto: 'bg-blue-100 text-blue-700',
    em_andamento: 'bg-amber-100 text-amber-700',
    resolvido: 'bg-green-100 text-green-700',
    fechado: 'bg-gray-100 text-gray-700'
  }[ticket.status] || 'bg-gray-100 text-gray-700';

  return (
    <div 
      className="p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
          {ticket.assunto}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor}`}>
          {ticket.status}
        </span>
      </div>
      {ticket.mensagem && (
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
          {ticket.mensagem}
        </p>
      )}
      <span className="text-[10px] text-[var(--text-tertiary)]">
        {format(new Date(ticket.created_date), 'dd/MM/yy HH:mm', { locale: ptBR })}
      </span>
    </div>
  );
}

export default function HistoricoAtendimentosCard({ clienteId, escritorioId, onRegistrar }) {
  if (!clienteId || !escritorioId) return null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: cliente } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: async () => {
      const clientes = await base44.entities.Cliente.filter({ id: clienteId });
      return clientes[0];
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000
  });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets-cliente', clienteId, cliente?.email],
    queryFn: async () => {
      if (!cliente?.email) return [];
      const all = await base44.entities.Ticket.filter({ 
        escritorio_id: escritorioId,
        email_solicitante: cliente.email
      });
      return all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!clienteId && !!escritorioId && !!cliente?.email,
    staleTime: 2 * 60 * 1000
  });

  const filteredTickets = tickets.filter(t =>
    t.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.mensagem?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            HISTÓRICO ({tickets.length})
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={onRegistrar}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Nova Conversa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <MessageCircle className="w-8 h-8 mx-auto text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-tertiary)]">
              {searchTerm ? 'Nenhum atendimento encontrado' : 'Nenhum atendimento registrado'}
            </p>
            {!searchTerm && onRegistrar && (
              <Button
                size="sm"
                onClick={onRegistrar}
                className="bg-[var(--brand-primary)]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Iniciar Conversa
              </Button>
            )}
          </div>
        ) : (
          <>
            {tickets.length > 3 && (
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-[var(--text-tertiary)]" />
                <Input
                  placeholder="Buscar atendimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            )}
            <ScrollArea className="max-h-[280px]">
              <div className="space-y-2">
                {filteredTickets.map((ticket) => (
                  <TicketHistoryItem
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => navigate(`${createPageUrl('MeusTickets')}?ticketId=${ticket.id}`)}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}