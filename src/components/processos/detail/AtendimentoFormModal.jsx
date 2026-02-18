import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AtendimentoFormModal({ open, onClose, atendimento, onSave }) {
  const [formData, setFormData] = React.useState(atendimento || { tipo_atendimento: 'ligacao' });

  React.useEffect(() => {
    if (atendimento) setFormData(atendimento);
  }, [atendimento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>{atendimento ? 'Editar' : 'Novo'} Atendimento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Select value={formData.tipo_atendimento} onValueChange={v => setFormData({...formData, tipo_atendimento: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ligacao">Ligação</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="mensagem">Mensagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Data</Label>
            <Input type="datetime-local" value={formData.data || ''} onChange={e => setFormData({...formData, data: e.target.value})} />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea value={formData.observacoes || ''} onChange={e => setFormData({...formData, observacoes: e.target.value})} rows={3} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}