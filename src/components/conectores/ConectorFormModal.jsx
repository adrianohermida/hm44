import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ConectorFormModal({ conector, onClose, onSave }) {
  const [form, setForm] = useState(conector || {
    nome: '',
    tipo: 'REST',
    base_url: '',
    versao: '',
    ativo: true
  });

  const salvar = async () => {
    try {
      const user = await base44.auth.me();
      const escritorio = await base44.entities.Escritorio.filter({ created_by: user.email });
      
      if (conector) {
        await base44.entities.ConectorAPI.update(conector.id, form);
      } else {
        await base44.entities.ConectorAPI.create({
          ...form,
          escritorio_id: escritorio[0]?.id
        });
      }
      toast.success('Conector salvo');
      onSave();
    } catch {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{conector ? 'Editar' : 'Novo'} Conector</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          <Select value={form.tipo} onValueChange={v => setForm({...form, tipo: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['REST','SOAP','GRAPHQL'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="URL Base" value={form.base_url} onChange={e => setForm({...form, base_url: e.target.value})} />
          <Input placeholder="Versão" value={form.versao} onChange={e => setForm({...form, versao: e.target.value})} />
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}