import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProvedorSelector({ value, onChange }) {
  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores'],
    queryFn: () => base44.entities.ProvedorAPI.list()
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecione provedor" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos provedores</SelectItem>
        {provedores.map(p => (
          <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}