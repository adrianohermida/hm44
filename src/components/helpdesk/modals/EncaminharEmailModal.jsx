import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EncaminharEmailModal({ open, onClose, ticket, conteudoOriginal }) {
  const queryClient = useQueryClient();
  const [destinatario, setDestinatario] = useState('');
  const [mensagem, setMensagem] = useState(conteudoOriginal || '');

  const encaminharMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      
      const escritorio = await base44.entities.Escritorio.list();

      await base44.functions.invoke('sendEmailSendGrid', {
        to: destinatario,
        subject: `Fwd: ${ticket.titulo} [ticket-${ticket.id.substring(0, 8)}]`,
        body: `
          <p><strong>---------- Mensagem encaminhada ----------</strong></p>
          <p><strong>De:</strong> ${ticket.cliente_email}</p>
          <p><strong>Assunto:</strong> ${ticket.titulo}</p>
          <p><strong>Data:</strong> ${new Date(ticket.created_date).toLocaleString('pt-BR')}</p>
          <hr/>
          ${mensagem}
        `,
        ticket_id: ticket.id
      });

      await base44.entities.TicketMensagem.create({
        ticket_id: ticket.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'agente',
        conteudo: `Email encaminhado para: ${destinatario}`,
        canal: 'email',
        escritorio_id: escritorio[0].id,
        is_internal_note: true
      });

      await base44.entities.Ticket.update(ticket.id, {
        ultima_atualizacao: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-mensagens', ticket.id]);
      toast.success('Email encaminhado');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao encaminhar: ' + error.message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Encaminhar Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Para *</Label>
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={8}
              placeholder="Adicione comentários ao email encaminhado..."
            />
          </div>

          <div className="bg-gray-50 border rounded p-3 text-xs">
            <div><strong>Assunto original:</strong> {ticket.titulo}</div>
            <div className="mt-1"><strong>De:</strong> {ticket.cliente_email}</div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={encaminharMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => encaminharMutation.mutate()}
              disabled={!destinatario || encaminharMutation.isPending}
              className="bg-[var(--brand-primary)]"
            >
              {encaminharMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Encaminhando...
                </>
              ) : (
                'Encaminhar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}