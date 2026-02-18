import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EncaminharTicketModal({ 
  open, 
  onClose, 
  ticket,
  onConfirm,
  isLoading 
}) {
  const [destinatario, setDestinatario] = useState('');
  const [mensagem, setMensagem] = useState('');

  const { data: users = [] } = useQuery({
    queryKey: ['users-team'],
    queryFn: () => base44.entities.User.filter({ role: 'admin' })
  });

  const handleEncaminhar = () => {
    onConfirm({
      ticket_id: ticket.id,
      destinatario_email: destinatario,
      mensagem
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Encaminhar ticket</DialogTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Encaminhe este ticket para outro membro da equipe
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="font-mono text-xs text-[var(--brand-primary)] mb-1">
              #{ticket?.numero_ticket}
            </p>
            <p className="text-sm font-medium">{ticket?.titulo}</p>
          </div>

          <div className="space-y-2">
            <Label>Encaminhar para *</Label>
            <Select value={destinatario} onValueChange={setDestinatario}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro da equipe" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.full_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mensagem (opcional)</Label>
            <Textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Adicione uma nota sobre o encaminhamento..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEncaminhar} 
            disabled={!destinatario || isLoading}
            className="bg-[var(--brand-primary)]"
          >
            {isLoading ? 'Encaminhando...' : 'Encaminhar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}