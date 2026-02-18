import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ThreadsPanel({ ticketId }) {
  const [showForm, setShowForm] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const queryClient = useQueryClient();

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ['ticket-threads', ticketId],
    queryFn: () => base44.entities.TicketThread.filter({ ticket_id: ticketId }),
    enabled: !!ticketId
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list()
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.TicketThread.create({
        ticket_id: ticketId,
        escritorio_id: escritorio[0].id,
        mensagem: data.mensagem,
        autor_email: user.email,
        autor_nome: user.full_name,
        privado: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-threads']);
      setMensagem('');
      setShowForm(false);
      toast.success('Discussão adicionada');
    }
  });

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-gray-500">Carregando...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="outline"
          size="sm"
          className="w-full gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Iniciar uma discussão
        </Button>

        {showForm && (
          <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
            <Textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Inicie uma discussão contextual para o ticket com seus colegas de equipe"
              className="min-h-[80px] text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => createMutation.mutate({ mensagem })}
                disabled={!mensagem.trim() || createMutation.isPending || !escritorio?.[0]?.id}
                size="sm"
                className="gap-2"
              >
                <Send className="w-3 h-3" />
                Enviar
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setMensagem('');
                }}
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {threads.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Nenhuma discussão interna</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <div key={thread.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-700">
                      {thread.autor_nome?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700">
                      {thread.autor_nome}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(thread.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {thread.mensagem}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}