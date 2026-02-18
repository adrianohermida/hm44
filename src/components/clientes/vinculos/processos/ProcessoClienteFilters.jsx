import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

export default function ProcessoClienteFilters({ filtros, onChange, tribunais }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
      <Select 
        value={filtros.status} 
        onValueChange={(val) => onChange({ ...filtros, status: val })}
      >
        <SelectTrigger className="w-36 bg-[var(--bg-primary)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="suspenso">Suspenso</SelectItem>
          <SelectItem value="arquivado">Arquivado</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        value={filtros.tribunal} 
        onValueChange={(val) => onChange({ ...filtros, tribunal: val })}
      >
        <SelectTrigger className="w-40 bg-[var(--bg-primary)]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos Tribunais</SelectItem>
          {tribunais.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}