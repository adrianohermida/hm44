import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

export default function RegistroTempoModal({ open, onClose, ticket }) {
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
  const [faturavel, setFaturavel] = useState(true);
  const [anotacao, setAnotacao] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list()
  });

  const registrarMutation = useMutation({
    mutationFn: async () => {
      const totalMinutos = (parseInt(horas || 0) * 60) + parseInt(minutos || 0);
      
      await base44.entities.TicketThread.create({
        ticket_id: ticket.id,
        escritorio_id: escritorio[0].id,
        mensagem: `⏱️ Tempo registrado: ${horas || 0}h ${minutos || 0}min${faturavel ? ' (Faturável)' : ''}\n${anotacao ? `\nAnotação: ${anotacao}` : ''}`,
        autor_email: user.email,
        autor_nome: user.full_name,
        privado: true
      });

      await base44.entities.Ticket.update(ticket.id, {
        ultima_atualizacao: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-threads']);
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Tempo registrado');
      onClose();
      setHoras('');
      setMinutos('');
      setAnotacao('');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Registrar tempo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2">Agente</Label>
            <div className="text-sm font-medium text-gray-700">
              {user?.full_name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-2">Horas</Label>
              <Input
                type="number"
                min="0"
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
                placeholder="0"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-sm mb-2">Minutos</Label>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutos}
                onChange={(e) => setMinutos(e.target.value)}
                placeholder="0"
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Faturável</Label>
            <Switch
              checked={faturavel}
              onCheckedChange={setFaturavel}
            />
          </div>

          <div>
            <Label className="text-sm mb-2">Anotação</Label>
            <Textarea
              value={anotacao}
              onChange={(e) => setAnotacao(e.target.value)}
              placeholder="Descreva a atividade realizada..."
              className="text-sm min-h-[80px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => registrarMutation.mutate()}
              disabled={(!horas && !minutos) || registrarMutation.isPending || !escritorio?.[0]?.id}
              className="bg-[var(--brand-primary)]"
            >
              Registrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}