import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import ThreadsList from '../threads/ThreadsList';
import ThreadComposer from '../threads/ThreadComposer';

export default function TicketThreadsPanel({ ticket }) {
  const [novaMensagem, setNovaMensagem] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: threads = [] } = useQuery({
    queryKey: ['ticket-threads', ticket.id],
    queryFn: () => base44.entities.TicketThread.filter(
      { ticket_id: ticket.id },
      '-created_date'
    ),
    refetchInterval: 3000
  });

  const criarThreadMutation = useMutation({
    mutationFn: (data) => base44.entities.TicketThread.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-threads', ticket.id]);
      setNovaMensagem('');
      toast.success('Discussão adicionada');
    }
  });

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return;

    const mencoes = novaMensagem.match(/@(\S+)/g)?.map(m => m.substring(1)) || [];

    criarThreadMutation.mutate({
      ticket_id: ticket.id,
      escritorio_id: ticket.escritorio_id,
      mensagem: novaMensagem,
      autor_email: user.email,
      autor_nome: user.full_name,
      mencoes
    });
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-elevated)]">
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="font-semibold">Discussões Internas</h3>
          <span className="text-xs text-[var(--text-tertiary)]">
            ({threads.length})
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Converse com sua equipe. Use @email para mencionar
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <ThreadsList threads={threads} />
      </ScrollArea>

      <ThreadComposer
        value={novaMensagem}
        onChange={setNovaMensagem}
        onSubmit={handleEnviar}
        isLoading={criarThreadMutation.isPending}
      />
    </div>
  );
}