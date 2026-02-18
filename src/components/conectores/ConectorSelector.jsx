import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ConectorSelector({ value, onChange }) {
  const { data: conectores = [] } = useQuery({
    queryKey: ['conectores'],
    queryFn: () => base44.entities.ConectorAPI.list()
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Filtrar por conector" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os conectores</SelectItem>
        {conectores.map(c => (
          <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}