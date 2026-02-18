import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ConsultaFilters({ status, onStatusChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs md:text-sm text-[var(--text-secondary)]">Status:</span>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32 md:w-40 h-9" aria-label="Filtrar por status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="novo">Novos</SelectItem>
          <SelectItem value="aprovado">Aprovados</SelectItem>
          <SelectItem value="agendado">Agendados</SelectItem>
          <SelectItem value="rejeitado">Rejeitados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}