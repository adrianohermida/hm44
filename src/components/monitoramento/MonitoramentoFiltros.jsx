import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function MonitoramentoFiltros({ onFiltroChange, onOrdenacaoChange, onBuscaChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <Input
          placeholder="Buscar por termo..."
          className="pl-10"
          onChange={(e) => onBuscaChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onFiltroChange} defaultValue="todos">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="com_novas">Com novas aparições</SelectItem>
          <SelectItem value="sem_novas">Sem novas aparições</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onOrdenacaoChange} defaultValue="recentes">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recentes">Mais recentes</SelectItem>
          <SelectItem value="antigas">Mais antigas</SelectItem>
          <SelectItem value="mais_aparicoes">Mais aparições</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}