import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MesclarTicketsModal({ 
  open, 
  onClose, 
  selectedTickets = [],
  onConfirm,
  isLoading 
}) {
  const [ticketPrincipal, setTicketPrincipal] = useState(selectedTickets[0]?.id);
  const [busca, setBusca] = useState('');
  const [adicionarDestino, setAdicionarDestino] = useState(false);

  const handleMesclar = () => {
    onConfirm({
      ticket_principal_id: ticketPrincipal,
      tickets_secundarios: selectedTickets.filter(t => t.id !== ticketPrincipal).map(t => t.id),
      adicionar_campo_cc: adicionarDestino
    });
  };

  const ticketsFiltrados = selectedTickets.filter(t =>
    t.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
    t.numero_ticket?.includes(busca)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mesclar ticket</DialogTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            {selectedTickets.length} ticket(s) selecionado(s). Interações de tickets secundários serão adicionadas ao ticket principal. As threads de discussões dos tickets secundários serão descartadas.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ticket Principal</Label>
            <RadioGroup value={ticketPrincipal} onValueChange={setTicketPrincipal}>
              {selectedTickets.map(ticket => (
                <div key={ticket.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={ticket.id} id={ticket.id} />
                  <label htmlFor={ticket.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-[var(--brand-primary)]">
                        #{ticket.numero_ticket}
                      </span>
                      <Badge variant="outline">{ticket.status}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">{ticket.titulo}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      {ticket.cliente_nome} • Criado há {Math.round((Date.now() - new Date(ticket.created_date)) / (1000 * 60 * 60 * 24))} dias
                    </p>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tickets Secundários ({selectedTickets.filter(t => t.id !== ticketPrincipal).length})</Label>
              <Button variant="link" size="sm" className="text-xs">
                Editar anotação
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedTickets
                .filter(t => t.id !== ticketPrincipal)
                .map(ticket => (
                  <div key={ticket.id} className="p-2 border rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[var(--brand-primary)]">
                        #{ticket.numero_ticket}
                      </span>
                      <span className="text-sm flex-1 truncate">{ticket.titulo}</span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Grupo: - - - • Agente: - -
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="add-cc"
              checked={adicionarDestino}
              onChange={(e) => setAdicionarDestino(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="add-cc" className="text-sm">
              Adicionar destinatário do ticket secundário no campo Cc
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleMesclar} 
            disabled={isLoading}
            className="bg-[var(--brand-primary)]"
          >
            {isLoading ? 'Mesclando...' : 'Mesclar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}