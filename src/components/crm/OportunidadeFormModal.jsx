import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function OportunidadeFormModal({ oportunidade, open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(oportunidade || {
    titulo: '',
    valor_estimado: 0,
    probabilidade: 50,
    stage: 'prospeccao'
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      const payload = { ...data, escritorio_id: user.escritorio_id, responsavel_email: user.email };
      
      if (oportunidade?.id) {
        return base44.entities.Oportunidade.update(oportunidade.id, payload);
      }
      return base44.entities.Oportunidade.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['oportunidades']);
      toast.success(oportunidade?.id ? 'Oportunidade atualizada' : 'Oportunidade criada');
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
          <DialogTitle>{oportunidade?.id ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ex: Revisão de contrato - Empresa X"
            />
          </div>

          <div>
            <Label>Valor Estimado (R$)</Label>
            <Input
              type="number"
              value={formData.valor_estimado}
              onChange={(e) => setFormData(prev => ({ ...prev, valor_estimado: Number(e.target.value) }))}
            />
          </div>

          <div>
            <Label>Probabilidade (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.probabilidade}
              onChange={(e) => setFormData(prev => ({ ...prev, probabilidade: Number(e.target.value) }))}
            />
          </div>

          <div>
            <Label>Etapa</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospeccao">Prospecção</SelectItem>
                <SelectItem value="qualificacao">Qualificação</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="negociacao">Negociação</SelectItem>
                <SelectItem value="fechamento">Fechamento</SelectItem>
                <SelectItem value="ganho">Ganho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => saveMutation.mutate(formData)}
            disabled={!formData.titulo || saveMutation.isPending}
            className="bg-[var(--brand-primary)]"
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {oportunidade?.id ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}