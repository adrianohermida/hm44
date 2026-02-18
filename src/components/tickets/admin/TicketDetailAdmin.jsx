import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send, User, UserCheck, X, Mail } from 'lucide-react';
import EmailComposerModal from '@/components/comunicacao/EmailComposerModal';
import TicketAssignment from './TicketAssignment';
import TicketSpamToggle from './TicketSpamToggle';
import EmailBadge from '@/components/comunicacao/EmailBadge';
import EmailStatusBadge from '@/components/comunicacao/EmailStatusBadge';
import AISuggestionsPanel from './AISuggestionsPanel';
import AutoClassifyButton from './AutoClassifyButton';
import ResponseTemplates from './ResponseTemplates';

const MessageBubble = ({ mensagem, isAgent }) => (
  <div className={`flex gap-2 ${isAgent ? 'justify-end' : 'justify-start'}`}>
    {!isAgent && (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-gray-600" />
      </div>
    )}
    <div className={`max-w-[70%] ${isAgent ? 'order-first' : ''}`}>
      <div className={`rounded-lg p-3 ${
        isAgent 
          ? 'bg-[var(--brand-primary)] text-white' 
          : 'bg-gray-100 text-[var(--text-primary)]'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
        {mensagem.canal === 'email' && (
          <div className="flex items-center gap-2 mt-2 opacity-70">
            <Mail className="w-3 h-3" />
            <span className="text-xs">via e-mail</span>
          </div>
        )}
      </div>
      {mensagem.canal === 'email' && isAgent && (
        <div className="mt-1">
          <EmailStatusBadge mensagemId={mensagem.id} />
        </div>
      )}
      <div className="flex items-center gap-2 mt-1 px-1">
        <span className="text-xs text-[var(--text-tertiary)]">
          {mensagem.remetente_nome}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {format(new Date(mensagem.created_date), 'HH:mm', { locale: ptBR })}
        </span>
      </div>
    </div>
    {isAgent && (
      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
        <UserCheck className="w-4 h-4 text-[var(--brand-primary)]" />
      </div>
    )}
  </div>
);

export default function TicketDetailAdmin({ ticketId, onClose, onUpdate }) {
  const [mensagem, setMensagem] = useState('');
  const [novoStatus, setNovoStatus] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: ticket } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => base44.entities.Ticket.list().then(t => t.find(x => x.id === ticketId)),
    enabled: !!ticketId
  });

  const { data: mensagens = [] } = useQuery({
    queryKey: ['ticket-mensagens', ticketId],
    queryFn: () => base44.entities.TicketMensagem.filter({ ticket_id: ticketId }, 'created_date'),
    enabled: !!ticketId
  });

  const enviarMensagemMutation = useMutation({
    mutationFn: async (texto) => {
      const user = await base44.auth.me();
      return base44.entities.TicketMensagem.create({
        ticket_id: ticketId,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'agente',
        conteudo: texto,
        escritorio_id: ticket.escritorio_id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-mensagens']);
      setMensagem('');
      toast.success('Mensagem enviada');
      onUpdate?.();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => base44.entities.Ticket.update(ticketId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket']);
      queryClient.invalidateQueries(['tickets-admin']);
      setNovoStatus('');
      toast.success('Status atualizado');
      onUpdate?.();
    }
  });

  if (!ticket) return null;

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="truncate">{ticket.titulo}</CardTitle>
                {ticket.canal === 'email' && <EmailBadge />}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {ticket.cliente_email || ticket.cliente_nome}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[180px]">
              <TicketAssignment ticketId={ticket.id} currentResponsavel={ticket.responsavel_email} />
              <TicketSpamToggle ticketId={ticket.id} isSpam={ticket.is_spam} />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AutoClassifyButton ticketId={ticket.id} onClassified={() => queryClient.invalidateQueries(['ticket'])} />
              
              <Select value={novoStatus} onValueChange={setNovoStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={ticket.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="aguardando_cliente">Aguardando Cliente</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
              {novoStatus && (
                <Button
                  size="sm"
                  onClick={() => updateStatusMutation.mutate(novoStatus)}
                  disabled={updateStatusMutation.isPending}
                >
                  Atualizar
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEmailModalOpen(true)}
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 mb-4">
              {mensagens.map(msg => (
                <MessageBubble
                  key={msg.id}
                  mensagem={msg}
                  isAgent={msg.tipo_remetente === 'agente' || msg.tipo_remetente === 'admin'}
                />
              ))}
            </div>
            
            <div className="space-y-3 mt-6">
              <AISuggestionsPanel 
                ticketId={ticketId} 
                onSelectResponse={(texto) => setMensagem(texto)} 
              />
              <ResponseTemplates 
                onSelectTemplate={(texto) => setMensagem(texto)} 
              />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mensagem.trim()) {
                  enviarMensagemMutation.mutate(mensagem);
                }
              }}
              className="flex gap-2"
            >
              <Textarea
                placeholder="Digite sua resposta..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="flex-1 min-h-[60px] max-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (mensagem.trim()) {
                      enviarMensagemMutation.mutate(mensagem);
                    }
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!mensagem.trim() || enviarMensagemMutation.isPending}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <EmailComposerModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        ticket={ticket}
      />
    </div>
  );
}