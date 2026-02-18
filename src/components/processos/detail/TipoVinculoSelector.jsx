import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TipoVinculoSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>Tipo de Vínculo</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apenso">Apenso</SelectItem>
          <SelectItem value="recurso">Recurso</SelectItem>
          <SelectItem value="incidente">Incidente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}