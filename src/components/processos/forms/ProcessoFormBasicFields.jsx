import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProcessoFormBasicFields({ form, onChange, clientes }) {
  return (
    <>
      <div>
        <Label>Título do Processo</Label>
        <Input
          value={form.titulo}
          onChange={(e) => onChange({ ...form, titulo: e.target.value })}
          placeholder="Ex: Cliente x Empresa Ré"
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
        />
      </div>
      <div>
        <Label>Cliente *</Label>
        <Select value={form.cliente_id} onValueChange={(id) => onChange({ ...form, cliente_id: id })}>
          <SelectTrigger className="bg-[var(--bg-primary)] border-[var(--border-primary)]">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}