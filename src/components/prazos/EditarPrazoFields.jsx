import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditarPrazoFields({ data, setData }) {
  return (
    <>
      <div>
        <Label>Título</Label>
        <Input value={data.titulo} onChange={(e) => setData({ ...data, titulo: e.target.value })} />
      </div>
      <div>
        <Label>Tipo</Label>
        <Select value={data.tipo_prazo} onValueChange={(v) => setData({ ...data, tipo_prazo: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurso">Recurso</SelectItem>
            <SelectItem value="contestacao">Contestação</SelectItem>
            <SelectItem value="manifestacao">Manifestação</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Data Vencimento</Label>
        <Input type="date" value={data.data_vencimento} onChange={(e) => setData({ ...data, data_vencimento: e.target.value })} />
      </div>
    </>
  );
}