import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DepartamentoFormModal({ departamento, onClose, escritorioId }) {
  const [formData, setFormData] = useState(departamento || {
    nome: '',
    descricao: '',
    email: '',
    sla_padrao_horas: 24,
    cor: '#10b981'
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (departamento) {
        return base44.entities.Departamento.update(departamento.id, data);
      }
      return base44.entities.Departamento.create({ ...data, escritorio_id: escritorioId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['departamentos']);
      toast.success('Departamento salvo');
      onClose();
    }
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{departamento ? 'Editar' : 'Novo'} Departamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <Label>SLA Padrão (horas)</Label>
            <Input type="number" value={formData.sla_padrao_horas} onChange={(e) => setFormData({...formData, sla_padrao_horas: parseInt(e.target.value)})} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}