import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function PlanosFiltros({ filtros, onChange }) {
  return (
    <div className="p-4 space-y-3 border-b border-[var(--border-primary)]">
      <div>
        <Label className="text-xs">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Nome do cliente..."
            value={filtros.busca}
            onChange={(e) => onChange({ ...filtros, busca: e.target.value })}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Status</Label>
        <Select value={filtros.status} onValueChange={(v) => onChange({ ...filtros, status: v })}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="proposta">Proposta</SelectItem>
            <SelectItem value="negociacao">Negociação</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="em_execucao">Em Execução</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}