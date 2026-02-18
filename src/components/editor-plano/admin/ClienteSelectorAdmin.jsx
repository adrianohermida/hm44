import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export default function ClienteSelectorAdmin({ value, onChange, onNovoCliente }) {
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes-selector'],
    queryFn: () => base44.entities.Cliente.list('-created_date', 100)
  });

  return (
    <div className="space-y-3">
      <Label>Cliente *</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map(c => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome_completo} - {c.cpf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={onNovoCliente} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}