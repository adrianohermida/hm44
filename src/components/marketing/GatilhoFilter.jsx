import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GatilhoFilter({ value, onChange }) {
  return (
    <div className="flex gap-4">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendente">Pendentes</SelectItem>
          <SelectItem value="aprovado">Aprovados</SelectItem>
          <SelectItem value="rejeitado">Rejeitados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}