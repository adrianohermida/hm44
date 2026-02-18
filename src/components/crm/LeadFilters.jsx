import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LeadFilters({ filter, onFilterChange }) {
  return (
    <Select value={filter} onValueChange={onFilterChange}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="quente">Quentes</SelectItem>
        <SelectItem value="morno">Mornos</SelectItem>
        <SelectItem value="frio">Frios</SelectItem>
      </SelectContent>
    </Select>
  );
}