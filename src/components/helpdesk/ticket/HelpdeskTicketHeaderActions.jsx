import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Reply, StickyNote, Forward, MoreVertical, Merge, Clock, Flag, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EncaminharEmailModal from '../modals/EncaminharEmailModal';
import RegistroTempoModal from '../modals/RegistroTempoModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function HelpdeskTicketHeaderActions({ 
  ticket, 
  onResponder, 
  onAddNota, 
  onMesclar,
  onExcluir 
}) {
  const [showEncaminhar, setShowEncaminhar] = useState(false);
  const [showRegistroTempo, setShowRegistroTempo] = useState(false);
  const queryClient = useQueryClient();

  const spamMutation = useMutation({
    mutationFn: () => base44.entities.Ticket.update(ticket.id, {
      is_spam: !ticket.is_spam,
      status: ticket.is_spam ? 'triagem' : 'fechado',
      ultima_atualizacao: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success(ticket.is_spam ? 'Ticket desmarcado como spam' : 'Ticket marcado como spam');
    }
  });

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button 
          onClick={onResponder}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2"
          size="sm"
        >
          <Reply className="w-4 h-4" />
          <span className="hidden sm:inline">Responder</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onAddNota}
          size="sm"
          className="gap-2"
        >
          <StickyNote className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar anotação</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowEncaminhar(true)}
          size="sm"
          className="gap-2"
        >
          <Forward className="w-4 h-4" />
          <span className="hidden lg:inline">Encaminhar</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowRegistroTempo(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Registrar tempo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMesclar} disabled={!onMesclar}>
              <Merge className="w-4 h-4 mr-2" />
              Mesclar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => spamMutation.mutate()} disabled={spamMutation.isPending}>
              <Flag className="w-4 h-4 mr-2" />
              {ticket.is_spam ? 'Desmarcar spam' : 'Marcar spam'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExcluir} disabled={!onExcluir} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EncaminharEmailModal
        open={showEncaminhar}
        onClose={() => setShowEncaminhar(false)}
        ticket={ticket}
      />

      <RegistroTempoModal
        open={showRegistroTempo}
        onClose={() => setShowRegistroTempo(false)}
        ticket={ticket}
      />
    </>
  );
}