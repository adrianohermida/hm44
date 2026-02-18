import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VinculoForm({ onSubmit, onCancel, clienteAtual }) {
  const [form, setForm] = useState({
    tipo_vinculo: 'socio',
    cargo: '',
    percentual_participacao: '',
    data_inicio: ''
  });

  return (
    <div className="space-y-3">
      <div>
        <Label>Tipo de Vínculo</Label>
        <Select value={form.tipo_vinculo} onValueChange={(v) => setForm({ ...form, tipo_vinculo: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="representante_legal">Representante Legal</SelectItem>
            <SelectItem value="procurador">Procurador</SelectItem>
            <SelectItem value="socio">Sócio</SelectItem>
            <SelectItem value="administrador">Administrador</SelectItem>
            <SelectItem value="preposto">Preposto</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {form.tipo_vinculo === 'socio' && (
        <div>
          <Label>Participação (%)</Label>
          <Input type="number" value={form.percentual_participacao} onChange={(e) => setForm({ ...form, percentual_participacao: e.target.value })} />
        </div>
      )}
      <div>
        <Label>Cargo/Função</Label>
        <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSubmit(form)}>Adicionar</Button>
      </div>
    </div>
  );
}