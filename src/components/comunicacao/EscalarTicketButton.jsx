import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

export default function EscalarTicketButton({ conversa }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const escalarMutation = useMutation({
    mutationFn: async () => {
      const ticket = await base44.entities.Ticket.create({
        titulo: `[Chat] ${conversa.cliente_nome}`,
        descricao: conversa.ultima_mensagem || 'Conversa escalada do chat',
        cliente_email: conversa.cliente_email,
        cliente_nome: conversa.cliente_nome,
        origem_conversa_id: conversa.id,
        categoria: 'chat_escalado',
        canal: conversa.canal,
        prioridade: 'media',
        escritorio_id: conversa.escritorio_id
      });

      await base44.entities.Conversa.update(conversa.id, {
        ticket_id: ticket.id,
        status: 'escalada'
      });

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversas']);
      setOpen(false);
      toast.success('Conversa escalada para ticket');
    }
  });

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        disabled={conversa.status === 'escalada'}
        className="gap-2"
      >
        <ArrowUpCircle className="w-4 h-4" />
        {conversa.status === 'escalada' ? 'Escalado' : 'Escalar para Ticket'}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalar para Ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta conversa será transformada em um ticket formal para atendimento assíncrono.
              O histórico de mensagens será preservado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              onClick={() => escalarMutation.mutate()}
              disabled={escalarMutation.isPending}
            >
              {escalarMutation.isPending ? 'Escalando...' : 'Confirmar'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}