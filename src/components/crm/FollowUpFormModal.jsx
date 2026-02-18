import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function FollowUpFormModal({ followup, open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(followup || {
    lead_id: '',
    tipo: 'email',
    titulo: '',
    descricao: '',
    data_agendada: '',
    prioridade: 'media'
  });

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['leads-select'],
    queryFn: async () => {
      return base44.entities.Lead.filter({
        escritorio_id: user.escritorio_id
      });
    },
    enabled: !!user?.escritorio_id && open
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, escritorio_id: user.escritorio_id, responsavel_email: user.email };
      
      if (followup?.id) {
        return base44.entities.Followup.update(followup.id, payload);
      }
      return base44.entities.Followup.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['followups']);
      toast.success(followup?.id ? 'Follow-up atualizado' : 'Follow-up agendado');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao salvar: ' + error.message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{followup?.id ? 'Editar Follow-up' : 'Agendar Follow-up'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Lead *</Label>
            <Select
              value={formData.lead_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, lead_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.nome} - {lead.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telefone">Telefone</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="tarefa">Tarefa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Título *</Label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Ligar para apresentar proposta"
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={2}
            />
          </div>

          <div>
            <Label>Data e Hora *</Label>
            <Input
              type="datetime-local"
              value={formData.data_agendada}
              onChange={(e) => setFormData(prev => ({ ...prev, data_agendada: e.target.value }))}
            />
          </div>

          <div>
            <Label>Prioridade</Label>
            <Select
              value={formData.prioridade}
              onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={!formData.titulo || !formData.lead_id || !formData.data_agendada || saveMutation.isPending}
            className="bg-[var(--brand-primary)]"
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {followup?.id ? 'Atualizar' : 'Agendar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}