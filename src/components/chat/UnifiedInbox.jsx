import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

/**
 * Unified inbox: chat + tickets integrados
 * Permite @mentions, thread mode, reações
 */
export default function UnifiedInbox({ clienteId, clienteNome }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [searchText, setSearchText] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  // Fetch conversas e tickets
  const { data: conversas = [] } = useQuery({
    queryKey: ['conversas-cliente', clienteId],
    queryFn: () => base44.entities.Conversa.filter({ cliente_id: clienteId }),
    enabled: !!clienteId,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets-cliente', clienteId],
    queryFn: () => base44.entities.Ticket.filter({ cliente_id: clienteId }),
    enabled: !!clienteId,
  });

  const createMensagemMutation = useMutation({
    mutationFn: async (conversa_id, texto) => {
      return await base44.entities.Mensagem.create({
        conversa_id,
        conteudo: texto,
        cliente_id: clienteId,
        tipo: 'cliente',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversas-cliente']);
      setNewMessage('');
      toast.success('Mensagem enviada');
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (titulo, descricao) => {
      return await base44.entities.Ticket.create({
        titulo,
        descricao,
        cliente_id: clienteId,
        status: 'aberto',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets-cliente']);
      setNewMessage('');
      toast.success('Ticket criado');
    },
  });

  const filteredConversas = conversas.filter(c =>
    c.titulo?.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredTickets = tickets.filter(t =>
    t.titulo?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Caixa de Entrada Unificada</CardTitle>
          <Button size="icon" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              placeholder="Buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">
              Chat ({conversas.length})
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex-1">
              Tickets ({tickets.length})
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 overflow-y-auto space-y-2">
            {filteredConversas.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-[var(--text-secondary)]">
                <p className="text-sm">Nenhuma conversa</p>
              </div>
            ) : (
              filteredConversas.map((conversa) => (
                <div
                  key={conversa.id}
                  className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] cursor-pointer transition-colors"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {conversa.titulo}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {conversa.ultima_mensagem || 'Sem mensagens'}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="flex-1 overflow-y-auto space-y-2">
            {filteredTickets.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-[var(--text-secondary)]">
                <p className="text-sm">Nenhum ticket</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] cursor-pointer transition-colors"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {ticket.titulo}
                  </p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {ticket.status}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {ticket.prioridade}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}