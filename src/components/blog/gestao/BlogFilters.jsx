import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BlogFilters({ filters, onChange }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por título..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Status</SelectItem>
          <SelectItem value="rascunho">📝 Rascunho</SelectItem>
          <SelectItem value="revisao">👀 Em Revisão</SelectItem>
          <SelectItem value="agendado">📅 Agendado</SelectItem>
          <SelectItem value="publicado">✅ Publicado</SelectItem>
          <SelectItem value="arquivado">📦 Arquivado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.categoria} onValueChange={(v) => onChange({ ...filters, categoria: v })}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="superendividamento">Superendividamento</SelectItem>
          <SelectItem value="direito_consumidor">Direito do Consumidor</SelectItem>
          <SelectItem value="negociacao_dividas">Negociação de Dívidas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}