import React, { useState } from 'react';
import { MessageSquare, History, Inbox, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import HelpdeskTicketHeader from './HelpdeskTicketHeader';
import HelpdeskTicketMessages from './HelpdeskTicketMessages';
import HelpdeskTicketComposer from './HelpdeskTicketComposer';
import TicketTimelineDetalhada from './TicketTimelineDetalhada';
import TicketMescladoBanner from './TicketMescladoBanner';
import TicketsMescladosPanel from './TicketsMescladosPanel';
import TicketSidebarAccordion from './TicketSidebarAccordion';
import HelpdeskTicketHeaderActions from './HelpdeskTicketHeaderActions';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function HelpdeskTicketPanel({ ticket, onClose }) {
  const [modoResposta, setModoResposta] = useState(false);
  const [modoNota, setModoNota] = useState(false);
  const composerRef = React.useRef(null);

  const handleNavigateToTicket = (ticketId) => {
    window.location.href = window.location.pathname + `?ticket=${ticketId}`;
  };

  const handleResponder = () => {
    setModoResposta(true);
    setModoNota(false);
    composerRef.current?.focus();
  };

  const handleAddNota = () => {
    setModoNota(true);
    setModoResposta(true);
    composerRef.current?.focus();
  };

  const handleMesclar = () => {
    toast.info('Selecione múltiplos tickets na lista para mesclar');
  };

  const handleExcluir = async () => {
    if (!confirm('Tem certeza que deseja excluir este ticket?')) return;
    
    try {
      await base44.entities.Ticket.delete(ticket.id);
      toast.success('Ticket excluído');
      onClose();
    } catch (error) {
      toast.error('Erro ao excluir ticket');
    }
  };

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
        <MessageSquare className="w-12 h-12 text-[var(--text-tertiary)] mb-3" />
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          Selecione um ticket para ver detalhes
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)]">
      <HelpdeskTicketHeader ticket={ticket} onClose={onClose} />

      {ticket.ticket_principal_id && (
        <div className="px-3 pb-2">
          <TicketMescladoBanner 
            ticket={ticket} 
            onNavigate={handleNavigateToTicket}
          />
        </div>
      )}

      <Tabs defaultValue="mensagens" className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-y border-[var(--border-primary)]">
          <TabsTrigger value="mensagens" className="gap-1.5 data-[state=active]:bg-[var(--bg-primary)]">
            <Inbox className="w-4 h-4" />
            <span className="text-xs">Mensagens</span>
          </TabsTrigger>
          <TabsTrigger value="detalhes" className="gap-1.5 data-[state=active]:bg-[var(--bg-primary)]">
            <History className="w-4 h-4" />
            <span className="text-xs">Detalhes</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5 data-[state=active]:bg-[var(--bg-primary)]">
            <Link2 className="w-4 h-4" />
            <span className="text-xs">Timeline</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mensagens" className="mt-0 p-0">
          <div className="flex flex-col">
            <div className="max-h-[400px] overflow-y-auto">
              <HelpdeskTicketMessages ticketId={ticket.id} showThread={true} />
            </div>
            <div className="border-t border-[var(--border-primary)]">
              <div className="p-2">
                <HelpdeskTicketHeaderActions
                  ticket={ticket}
                  onResponder={handleResponder}
                  onAddNota={handleAddNota}
                  onMesclar={handleMesclar}
                  onExcluir={handleExcluir}
                />
              </div>
              <HelpdeskTicketComposer 
                ticket={ticket}
                ref={composerRef}
                modoNota={modoNota}
                onModoNotaChange={setModoNota}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detalhes" className="mt-0 p-3">
          <TicketSidebarAccordion ticket={ticket} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-0 p-3">
          <TicketTimelineDetalhada ticketId={ticket.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}