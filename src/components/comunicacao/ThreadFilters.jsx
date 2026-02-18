import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

export default function ThreadFilters({ filters, onFilterChange, onClearFilters }) {
  const hasActiveFilters = filters.status || filters.prioridade || filters.canal;

  return (
    <div className="p-3 border-b bg-gray-50 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtros</span>
        </div>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={onClearFilters} className="h-7 px-2">
            <X className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Select value={filters.status || 'all'} onValueChange={(value) => onFilterChange({ ...filters, status: value === 'all' ? null : value })}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="aberta">Aberta</SelectItem>
            <SelectItem value="respondida">Respondida</SelectItem>
            <SelectItem value="fechada">Fechada</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.prioridade || 'all'} onValueChange={(value) => onFilterChange({ ...filters, prioridade: value === 'all' ? null : value })}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.canal || 'all'} onValueChange={(value) => onFilterChange({ ...filters, canal: value === 'all' ? null : value })}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="chat_widget">Chat</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">E-mail</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}