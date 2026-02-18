import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ProcessoTicketModal({ processo, cliente, open, onClose }) {
  const [mensagem, setMensagem] = useState('');
  const queryClient = useQueryClient();

  const createTicketMutation = useMutation({
    mutationFn: async (data) => {
      const assunto = `${processo.numero_cnj} (${processo.polo_ativo || 'Cliente'} x ${processo.polo_passivo || 'Parte Contrária'})`;
      const ticket = await base44.entities.Ticket.create({
        ...data,
        assunto,
        processo_id: processo.id,
        cliente_id: cliente?.id,
        status: 'aberto'
      });
      await base44.entities.TicketMensagem.create({
        ticket_id: ticket.id,
        mensagem: data.mensagem,
        remetente: 'advogado'
      });
      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      toast.success('Atendimento registrado');
      onClose();
      setMensagem('');
    }
  });

  const handleSubmit = () => {
    if (!mensagem.trim()) return;
    createTicketMutation.mutate({ mensagem });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Mensagem - {cliente?.nome_completo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createTicketMutation.isPending}>
              {createTicketMutation.isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}