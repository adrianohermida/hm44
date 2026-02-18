import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Archive } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TicketSpamToggle({ ticketId, isSpam }) {
  const queryClient = useQueryClient();

  const toggleSpamMutation = useMutation({
    mutationFn: () => base44.entities.Ticket.update(ticketId, { 
      is_spam: !isSpam,
      status: !isSpam ? 'fechado' : 'aberto'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', ticketId]);
      queryClient.invalidateQueries(['tickets-admin']);
      toast.success(isSpam ? 'Movido para Inbox' : 'Marcado como Spam');
    }
  });

  return (
    <Button
      variant={isSpam ? "default" : "outline"}
      size="sm"
      onClick={() => toggleSpamMutation.mutate()}
    >
      {isSpam ? (
        <>
          <Archive className="w-4 h-4 mr-1" />
          Restaurar
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-1" />
          Spam
        </>
      )}
    </Button>
  );
}