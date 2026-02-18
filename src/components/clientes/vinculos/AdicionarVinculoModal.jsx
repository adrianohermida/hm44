import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function AdicionarVinculoModal({ open, onClose, clienteAtual, clientes, onSave }) {
  const [form, setForm] = useState({
    cliente_vinculado_id: '',
    tipo_vinculo: 'socio',
    cargo: '',
    percentual_participacao: ''
  });

  const clientesDisponiveis = clientes.filter(c => c.id !== clienteAtual.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Vínculo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cliente/Empresa</Label>
            <Select value={form.cliente_vinculado_id} onValueChange={(v) => setForm({ ...form, cliente_vinculado_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {clientesDisponiveis.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de Vínculo</Label>
            <Select value={form.tipo_vinculo} onValueChange={(v) => setForm({ ...form, tipo_vinculo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="socio">Sócio</SelectItem>
                <SelectItem value="representante_legal">Representante Legal</SelectItem>
                <SelectItem value="procurador">Procurador</SelectItem>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="tutor">Tutor/Curador</SelectItem>
                <SelectItem value="conjuge">Cônjuge</SelectItem>
                <SelectItem value="companheiro">Companheiro(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.tipo_vinculo === 'socio' && (
            <div>
              <Label>Participação (%)</Label>
              <Input type="number" value={form.percentual_participacao} onChange={(e) => setForm({ ...form, percentual_participacao: e.target.value })} />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => onSave(form)}>Adicionar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}