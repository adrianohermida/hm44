import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NotificacaoConfigFields({ tipo, setTipo, dias, setDias }) {
  return (
    <>
      <div>
        <Label>Tipo de Prazo</Label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="recurso">Recurso</SelectItem>
            <SelectItem value="contestacao">Contestação</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Dias de Antecedência</Label>
        <Input type="number" value={dias} onChange={(e) => setDias(e.target.value)} />
      </div>
    </>
  );
}