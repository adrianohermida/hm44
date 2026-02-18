import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TarefaFormModal({ open, onClose, onSave, tarefa, processoId }) {
  const [form, setForm] = useState(tarefa || {
    titulo: '',
    descricao: '',
    tipo: 'outra',
    prioridade: 'media',
    data_limite: '',
    responsavel_email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título da tarefa"
            value={form.titulo}
            onChange={(e) => setForm({...form, titulo: e.target.value})}
            required
          />
          <Textarea
            placeholder="Descrição (opcional)"
            value={form.descricao}
            onChange={(e) => setForm({...form, descricao: e.target.value})}
          />
          <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="prazo_processual">Prazo Processual</SelectItem>
              <SelectItem value="peticao">Petição</SelectItem>
              <SelectItem value="reuniao_cliente">Reunião Cliente</SelectItem>
              <SelectItem value="outra">Outra</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={form.data_limite}
            onChange={(e) => setForm({...form, data_limite: e.target.value})}
            required
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}