import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PrazoFormFields({ form, onChange }) {
  return (
    <>
      <div>
        <Label>Título *</Label>
        <Input
          value={form.titulo}
          onChange={(e) => onChange({ ...form, titulo: e.target.value })}
          placeholder="Descrição do prazo"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tipo</Label>
          <Select value={form.tipo} onValueChange={(v) => onChange({ ...form, tipo: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contestacao">Contestação</SelectItem>
              <SelectItem value="recurso">Recurso</SelectItem>
              <SelectItem value="manifestacao">Manifestação</SelectItem>
              <SelectItem value="peticao">Petição</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Vencimento *</Label>
          <Input
            type="date"
            value={form.data_vencimento}
            onChange={(e) => onChange({ ...form, data_vencimento: e.target.value })}
            required
          />
        </div>
      </div>
    </>
  );
}