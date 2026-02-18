import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, Calendar } from 'lucide-react';
import useClientesSelector from './hooks/useClientesSelector';

export default function ProcessoFilters({ filtros, onChange }) {
  const { clientes } = useClientesSelector();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="w-4 h-4 text-[var(--text-tertiary)] hidden md:block" />
      
      <Select value={filtros.status || 'todos'} onValueChange={(value) => onChange({ ...filtros, status: value })}>
        <SelectTrigger className="w-[120px] md:w-32 bg-[var(--bg-primary)] border-[var(--border-primary)] text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="favoritos">⭐ Favoritos</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="suspenso">Suspenso</SelectItem>
          <SelectItem value="arquivado">Arquivado</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filtros.cliente_id || 'todos'} onValueChange={(value) => onChange({ ...filtros, cliente_id: value })}>
        <SelectTrigger className="w-[140px] md:w-40 bg-[var(--bg-primary)] border-[var(--border-primary)] text-sm">
          <SelectValue placeholder="Cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos Clientes</SelectItem>
          {clientes.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filtros.publicacao || 'todos'} onValueChange={(value) => onChange({ ...filtros, publicacao: value })}>
        <SelectTrigger className="w-[140px] md:w-40 bg-[var(--bg-primary)] border-[var(--border-primary)] text-sm">
          <SelectValue placeholder="Publicações" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          <SelectItem value="ultimas_7d">Últimos 7 dias</SelectItem>
          <SelectItem value="ultimos_15d">Últimos 15 dias</SelectItem>
          <SelectItem value="ultimos_30d">Últimos 30 dias</SelectItem>
        </SelectContent>
      </Select>

      {filtros.publicacao !== 'todos' && filtros.publicacao && (
        <div className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded">
          <Calendar className="w-3 h-3" />
          <span>Filtrado por publicação</span>
        </div>
      )}
    </div>
  );
}