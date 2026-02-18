import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function EmailComposerModal({ open, onClose, ticket, defaultTo = '' }) {
  const queryClient = useQueryClient();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    to: defaultTo || ticket?.cliente_email || '',
    subject: ticket ? `Re: ${ticket.titulo}` : '',
    body: ''
  });

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      console.log('📧 [EmailComposer] Enviando email...', {
        to: formData.to,
        subject: formData.subject,
        ticket_id: ticket?.id
      });

      const response = await base44.functions.invoke('sendEmailSendGrid', {
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
        ticket_id: ticket?.id
      });

      console.log('✅ [EmailComposer] Resposta:', response.data);

      if (ticket) {
        queryClient.invalidateQueries(['ticket-mensagens', ticket.id]);
        queryClient.invalidateQueries(['ticket', ticket.id]);
        queryClient.invalidateQueries(['tickets-admin']);
      }

      toast.success('E-mail enviado com sucesso');
      setFormData({ to: '', subject: '', body: '' });
      onClose();
    } catch (error) {
      console.error('❌ [EmailComposer] Erro:', error);
      toast.error('Erro ao enviar e-mail: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
            Enviar E-mail
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Para *
            </label>
            <Input
              type="email"
              placeholder="cliente@exemplo.com"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              required
              disabled={!!ticket}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Assunto *
            </label>
            <Input
              type="text"
              placeholder="Assunto do e-mail"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Mensagem *
            </label>
            <Textarea
              placeholder="Escreva sua mensagem..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={sending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={sending || !formData.to || !formData.subject || !formData.body}
              className="bg-[var(--brand-primary)]"
            >
              {sending ? 'Enviando...' : 'Enviar E-mail'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}